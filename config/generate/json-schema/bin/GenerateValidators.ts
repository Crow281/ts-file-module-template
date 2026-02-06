/*
 * The MIT License
 *
 * Copyright 2025 Crow281.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * This script generates validation functions for all of the
 * JSON schemas inside of inputPath.
 * If you pass JSON types based on said schema, it will validate them
 * and ensure they match the desired type.
 *
 * Since the generated code is neither documented nor properly typed,
 * I am making the generated code internal and wrapping it with
 * a properly typed and documented function.
 */
import { getNPMPackageDependencyType } from "../../utils/HasNPMPackage";
import { inputToOutputPath } from "../../utils/InputToOutputPath";
import { readJSONGlob } from "../json/ReadJSONGlob";
import { fromTitleToTypeName } from "../json/schema/FromTitleToTypeName";
import { generateValidator } from "../validators/GenerateValidator";
import { generateDefinition } from "../validators/GenerateValidatorDefinition";
import { Ajv } from "ajv";
import addFormats from "ajv-formats";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Path to the JSON schemas we are operating on.
 *
 * Since this script is called at the project root,
 * that is what this path is relative to.
 */
const inputPattern: string = "./src/**/*.schema.json";

/**
 * Root path of the JSON schemas we are operating on.
 * Used to calculate their relative paths.
 *
 * Since this script is called at the project root,
 * that is what this path is relative to.
 */
const inputRoot: string = "./src";

/**
 * File path indicating where we want to output the results to.
 */
export const outputRoot: string = "./src";

/**
 * Records any of the generated validators that need
 * the ajv-format NPM package in order to work.
 */
const dependantOnAjvFormatsSchemas: string[] = [];

/**
 * Creates the Ajv object we will be using to create
 * validation functions with.
 * @param schemas
 * JSON schemas the Ajv will be creating validation functions for.
 * @returns
 * Ajv object we will use to create validation functions for a list of schemas.
 */
function createAjv(schemas: object[]): Ajv {
    //Create the ajv instance to process the schemas.
    const ajv = new Ajv({
        //List of schemas to create validation code for.
        schemas: schemas,

        //If false, validation only returns the 1st error it finds,
        //if true, it will return all of them.
        //Since the result is in an array in either case,
        //I've decided to make it true.
        allErrors: true,

        //Preferably, user should set error messages with ajv-i18n,
        //but leave default error messages for if they do not.
        messages: true,

        //When returning errors, include a reference to the schema and parent schema.
        verbose: true,

        //Activate strict mode.
        //This makes it less flexible in accepting schemas,
        //but also ensures that common mistakes are reported.
        strict: true,

        //Affects whether schema functions referencing other
        //schema copy the validation code into themselves or not.
        //TODO: I considered separating the validation functions
        //into separate modules, but ajv doesn't currently support that,
        //so there is no point in setting inlineRefs to false.
        //If the situation changes, look into it.
        inlineRefs: true,

        //How to generate the code.
        code: {
            //We are generating source files.
            source: true,

            //We are using CJS modules
            //because neither ajv-formats
            //nor Jest support ESM modules.
            esm: false,

            //Whether AJV will generate the code as a single line
            //or split it across several.
            //Since the code will be recompiled anyways,
            //we may as well make the generated code a bit easier to read.
            lines: true,

            //Improve the code.
            //Usually, 1 pass is enough.
            //2 passes will only improve code slightly
            //if using extremely complicated schemas.
            //But since this won't be used often
            //and a slight delay isn't a huge deal,
            //may as well ensure perfection.
            optimize: 2,
        },
    });

    //Add format support so that strings can be format validated.
    addFormats(ajv);

    return ajv;
}

/**
 *
 * @returns
 * String indicating which JSON schemas are dependant on ajv-formats.
 */
function createAjvDependantSchemasString(): string {
    //Fetch the list of schemas dependant on ajv-formats
    const dependants: string = dependantOnAjvFormatsSchemas.join("\n");

    //Create the desired string.
    const text: string =
        "The following generated JSON Schema validators " +
        'are dependant on NPM package "ajv-formats":\n\n' +
        dependants;

    return text;
}

/**
 *
 * @param code
 * Code we are checking.
 * @returns
 * true if the given source code is importing ajv-formats.
 */
function usesAjvFormats(code: string): boolean {
    //Check if the code is importing ajv-formats.
    //HACK: I am not aware of any official method to check whether
    //the generated validation function used ajv-formats.
    //This was the best I could come up with.
    //Depending on how AJV updates, this method of checking might become invalid.
    //Since the import can potentially involve subpaths of ajv-formats,
    //I end the check there.
    return code.includes(' = require("ajv-formats');
}

/**
 * Checks if the NPM package, ajv-format, is needed as a dependency
 * in order for the validation functions to work and whether
 * user already has it installed as a dependency.
 *
 * If ajv-format is needed and is not saved to
 * the NPM package's dependencies, it will log
 * a warning to user.
 * @returns
 * A promise that will trigger completion when check is done.
 */
async function logAjvFormatWarning(): Promise<void> {
    //If any of the validators are dependant on ajv-format.
    if (dependantOnAjvFormatsSchemas.length > 0) {
        //Check if ajv-format NPM package is installed.
        const dependencyType: string =
            await getNPMPackageDependencyType("ajv-formats");

        //Check ajv-format's installation.
        switch (dependencyType) {
            //If ajv-format is somehow not installed at all,
            //(unlikely as this script should fail
            //completely if that were the case)
            //tell user to install it.
            case "none":
                console.warn(
                    createAjvDependantSchemasString() +
                        "\n\n" +
                        "Install it by using the following console command:\n" +
                        "npm install ajv-formats",
                );
                break;

            //If ajv-format is a devDependency as opposed to a
            //library dependency, tell user to move it.
            case "devDependencies":
                console.warn(
                    createAjvDependantSchemasString() +
                        "\n\n" +
                        "You will need to modify package.json and move " +
                        'ajv-format\'s entry from "devDependencies" to ' +
                        '"dependencies".',
                );
                break;
        }
    }
}

/**
 * Writes the given text to the desired file.
 * @param moduleOutputPath
 * File path we want to write the module to.
 * @param code
 * Code we want to save to the module.
 * @returns
 * A promise that will trigger on operation completion or error.
 */
async function writeDirAndFile(filePath: string, text: string): Promise<void> {
    //Ensure folder exists.
    await mkdir(dirname(filePath), {
        recursive: true,
    });

    //Write the validation function to an es module file.
    await writeFile(filePath, text, {
        encoding: "utf-8",
    });
}

/**
 *
 * @param absoluteFilePath
 * File path the schema was read from.
 * @param schema
 * Schema being written.
 * @returns
 * A suitable file path to write the validator to.
 */
function toValidatorOutputPath(
    absoluteFilePath: string,
    schema: Record<string, unknown>,
): string {
    //Get the TypeScript Typename for the schema.
    const typeName: string = fromTitleToTypeName(schema);

    //Generate the output path.
    const outputPath: string = inputToOutputPath(
        inputRoot,
        outputRoot,
        absoluteFilePath,
        {
            //Converting to the name of the function, "Validate{moduleType}".
            transformBaseName: (oldBaseName: string): string => {
                return `Validate${typeName}`;
            },
            //Converting to a CommonJS Module file.
            transformFileExtension: (oldFileExtension: string): string => {
                return "cjs";
            },
        },
    );

    return outputPath;
}

/**
 *
 * @param absoluteFilePath
 * File path the schema was read from.
 * @param schema
 * Schema being written.
 * @returns
 * A suitable file path to write the validator wrapper to.
 */
function toDefinitionOutputPath(
    absoluteFilePath: string,
    schema: Record<string, unknown>,
): string {
    //Get the TypeScript Typename for the schema.
    const typeName: string = fromTitleToTypeName(schema);

    //Generate the output path.
    const outputPath: string = inputToOutputPath(
        inputRoot,
        outputRoot,
        absoluteFilePath,
        {
            //Converting to the name of the function, "Validate{moduleType}".
            transformBaseName: (oldBaseName: string): string => {
                return `Validate${typeName}`;
            },
            //Converting to a normal JavaScript file.
            transformFileExtension: (oldFileExtension: string): string => {
                return "d.ts";
            },
        },
    );

    return outputPath;
}

/**
 * Generates and writes the validation code for a single schema.
 * @param ajv
 * Ajv object being used to
 * @param absoluteInputFilePath
 * File path the schema was read from.
 * @param schema
 * Schema we want to write a validation function for.
 * @returns
 * A promise that will trigger on operation completion or error.
 */
async function writeValidator(
    ajv: Ajv,
    absoluteInputFilePath: string,
    schema: Record<string, unknown>,
): Promise<void> {
    //Generate code for this schema.
    const code: string = generateValidator(ajv, schema);

    //Generate file path for this validation function.
    const outputFilePath: string = toValidatorOutputPath(
        absoluteInputFilePath,
        schema,
    );

    //Check whether this validation function needs ajv-format.
    if (usesAjvFormats(code)) {
        //Fetch schema id.
        //If $id was anything other than string,
        //generateValidators would have already thrown an error.
        const schemaId: string = schema["$id"] as string;

        //Since this validation function needed ajv-format,
        //record that fact for later so that we can
        //remind the user to move ajv-formats
        //to NPM dependencies if necessary.
        dependantOnAjvFormatsSchemas.push(schemaId);
    }

    //Write the module with the validation function.
    await writeDirAndFile(outputFilePath, code);
}

/**
 * Since AJV does not type or document its output,
 * we are creating a wrapper to do that.
 * @param absoluteInputFilePath
 * File path the schema was read from.
 * @param schema
 * Schema we want to write a validation wrapper function for.
 * @returns
 * A promise that will trigger on operation completion or error.
 */
async function writeDefinition(
    absoluteInputFilePath: string,
    schema: Record<string, unknown>,
): Promise<void> {
    //Generate code for this schema's validation wrapper.
    const code: string = generateDefinition(schema);

    //Generate file path for this validation function.
    const outputFilePath: string = toDefinitionOutputPath(
        absoluteInputFilePath,
        schema,
    );

    //Write the module with the validation function.
    await writeDirAndFile(outputFilePath, code);
}

//Catch anything that goes wrong.
try {
    //Load the schemas.
    const absoluteFilePathToSchema: Map<
        string,
        Record<string, unknown>
    > = await readJSONGlob(inputPattern);

    //Get a list of all schema objects.
    const schemas: Record<string, unknown>[] = Array.from(
        absoluteFilePathToSchema.values(),
    );

    //Create Ajv object used to generate validation code.
    const ajv = createAjv(schemas);

    //Array of promises we need to wait on.
    const processPromises: Promise<void>[] = [];

    //Iterate all the schemas.
    for (const [absoluteFilePath, schema] of absoluteFilePathToSchema) {
        //Generate and write validator code for this schema.
        const validatorPromise: Promise<void> = writeValidator(
            ajv,
            absoluteFilePath,
            schema,
        );

        //Generate and write wrapper code for this schema.
        const definitionPromise: Promise<void> = writeDefinition(
            absoluteFilePath,
            schema,
        );

        //Save both operations.
        processPromises.push(validatorPromise, definitionPromise);
    }

    //Wait for all process promises to finish.
    await Promise.all(processPromises);

    //Check if ajv-format is needed and warn the user if so.
    await logAjvFormatWarning();

    //If anything goes wrong, print it.
} catch (error) {
    console.log(error);
}
