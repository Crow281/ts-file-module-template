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
 * This script reads all the JSON Schema files inside
 * of the source folder.
 * It then generates TypeScript interfaces for each of them.
 *
 * All of the JSON Schema files it is generating
 * interfaces for must have a "title" property,
 * which will be used to identify and name the new type.
 */
import { createGeneratedHeaderComment } from "../../utils/CreateGeneratedHeaderComment";
import { getLicenseComment } from "../../utils/GetLicenseComment";
import { ImportFactory } from "../../utils/ImportFactory";
import { inputToOutputPath } from "../../utils/InputToOutputPath";
import { readJSONGlob } from "../json/ReadJSONGlob";
import { toIdToSchemaMap } from "../json/ToIdToSchemaMap";
import { fromTitleToTypeName } from "../json/schema/FromTitleToTypeName";
import {
    FileInfo,
    JSONSchema,
} from "@apidevtools/json-schema-ref-parser/dist/lib/types";
import { compile } from "json-schema-to-typescript";
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

//Comment used to mark this as a generated file
//and comment telling user where script was created.
const generatedHeader: string = createGeneratedHeaderComment(import.meta.url);

//Fetch license text.
const licenseText: string = await getLicenseComment();

//Combined header source.
const fullHeader: string = `${generatedHeader}
${licenseText}`;

/**
 * Creates a Map, mapping JSON schema ids to the
 * path to the path needed to import them.
 * @param absoluteFilePathToSchema
 * A map, mapping the file paths JSON schema
 * were loaded from to the JSON schema objects themselves.
 * @returns
 * A map, mapping schema ids to the import path
 * used to import their interfaces.
 */
function createIdToImportPath(
    absoluteFilePathToSchema: Map<string, Record<string, unknown>>,
): Map<string, string> {
    //Mapping we are creating.
    const idToImportPath: Map<string, string> = new Map();

    //Iterate schema.
    for (const [absoluteFilePath, schema] of absoluteFilePathToSchema) {
        //Fetch schema's id.
        const id: unknown = schema["$id"];

        //If not a string, skip it.
        if (typeof id !== "string") {
            continue;
        }

        //Calculate the absolute path used to
        //import this JSON schema's interface.
        //This will basically convert the json schema path,
        //relative to the project, to a typescript module in the same folder.
        const absoluteImportPath: string = inputToOutputPath(
            inputRoot,
            "",
            absoluteFilePath,
            {
                //Remove file extension.
                transformFileExtension: (oldFileExtension: string): string => {
                    return "";
                },
            },
        );

        //Map the schema to its import path.
        idToImportPath.set(id, absoluteImportPath);
    }

    return idToImportPath;
}

/**
 * Generates code for a TypeScript interface representing the given
 * JSON schema.
 * @param schema
 * JSON schema we want to generate TypeScript interface code for.
 * @param idToSchema
 * Maps schema ids to the matching schema object.
 * @param idToImportPath
 * Maps JSON schema ids to the module path used to
 * import the given schema interface.
 * @returns
 * Typescript code for interface representing this schema.
 */
async function createInterfaceCode(
    schema: Record<string, unknown>,
    idToSchema: Map<string, Record<string, unknown>>,
    idToImportPath: Map<string, string>,
): Promise<string> {
    //Fetch schema's title as its type.
    const typeName: string = fromTitleToTypeName(schema);

    //This object will be used to manage importing each schema interface type.
    const importFactory: ImportFactory = new ImportFactory();

    //Create configuration object to define how code is generated.
    const compileOptions = {
        //bannerComment allows you to append text to the top of the code.
        //Empty out the banner since we need to
        //generate import code and add it later.
        bannerComment: "",

        //Make the code pretty.
        format: true,

        //Prettier settings for formatting the code.
        style: {
            //Avoid letting lines go over 80 characters.
            printWidth: 80,

            //Use 4 space indents.
            tabWidth: 4,

            //Use spaces for indents, not tabs.
            useTabs: false,
        },

        //We will be importing the external schema files
        //as opposed to declaring them within the same file.
        declareExternallyReferenced: false,

        //This function allows you to customize the type name
        //for each schema.
        //In our case, we are additionally using it to ensure
        //any schema with the same type name use aliases instead.
        customName: (
            customSchema: JSONSchema,
            keyNameFromDefinition: string | undefined,
        ): string | undefined => {
            //Use the keyName if that's all it has.
            if (keyNameFromDefinition) {
                return keyNameFromDefinition;
            }

            //Fetch title, which is what we will name the interface type.
            const customTitle: string | undefined = customSchema.title;

            //If this had a title.
            if (customTitle) {
                //Fetch module path for this schema.
                const modulePath: string | undefined = idToImportPath.get(
                    customSchema.$id,
                );

                //If this had a module path.
                if (modulePath) {
                    //Name we will be returning.
                    const aliasName: string = importFactory.import(
                        modulePath,
                        customTitle,
                    ).aliasName;

                    return aliasName;
                }
            }

            //If this doesn't have an interface name.
            return undefined;
        },

        //Root directory for resolving referenced schema.
        //Probably not necessary since we've already loaded everything.
        cwd: inputRoot,

        //Tell library how to resolve file references.
        $refOptions: {
            resolve: {
                file: {
                    //Tell file reader how to convert references to the file.
                    read: (
                        file: FileInfo,
                        callback?: (
                            error: Error | null,
                            data: string | null,
                        ) => unknown,
                    ): object | undefined => {
                        //Fetch url, AKA its id.
                        const id: string = file.url;

                        //Fetch schema corresponding to id.
                        const schema: Record<string, unknown> | undefined =
                            idToSchema.get(id);

                        return schema;
                    },
                },
            },
        },
    };

    //Let the library create the interface's source code
    //from the JSON schema object.
    const interfaceCode: string = await compile(
        schema,
        typeName,
        compileOptions,
    );

    //Fetch the schema's id.
    const id: unknown = schema["$id"];

    //If id is anything other than a string.
    if (typeof id !== "string") {
        //Trigger an error.
        throw new TypeError("Id has wrong type " + typeof id);
    }

    //Get the module path of the current schema interface being written.
    const modulePath: string | undefined = idToImportPath.get(id);

    //Create code used to import any other schema interfaces
    //this schema is dependant on.
    let importCode: string = importFactory.toCode(modulePath);

    //If there was import code.
    if (importCode.length > 0) {
        //Add a newline after it to separate it from interfaceCode.
        //If there wasn't import code,
        //there's already a newline to separate it from header.
        importCode += "\n";
    }

    //Assemble full code.
    //Generated comment, license comment,
    //import code, and then the interface itself.
    const code: string = `${fullHeader}
${importCode}
${interfaceCode}`;

    return code;
}

/**
 * Generates the file path we will be writing the interface
 * for schema from the given path to.
 * @param schemaAbsoluteFilePath
 * File location relative to base where the original schema file came from.
 *
 * Is used to determine where to write the resulting ES module to.
 * @returns
 * File path we should output the interface for the given schema to.
 */
function createOutputPath(schemaAbsoluteFilePath: string): string {
    //Generate the output path.
    const outputPath: string = inputToOutputPath(
        inputRoot,
        outputRoot,
        schemaAbsoluteFilePath,
        {
            //Converting to a TypeScript file.
            transformFileExtension: (oldFileExtension: string): string => {
                return "ts";
            },
        },
    );

    return outputPath;
}

/**
 * Writes the given code to the desired file.
 * @param moduleOutputPath
 * File path we want to write the module to.
 * @param code
 * Code we want to save to the module.
 * @returns
 * A promise that will trigger on operation completion or error.
 */
async function writeModule(
    moduleOutputPath: string,
    code: string,
): Promise<void> {
    //Ensure folder exists.
    await mkdir(dirname(moduleOutputPath), {
        recursive: true,
    });

    //Write the validation function to an es module file.
    await writeFile(moduleOutputPath, code, {
        encoding: "utf-8",
    });
}

/**
 * Creates the code for a given schema
 * and writes it to a file.
 * @param absoluteFilePath
 * File path the schema was loaded from.
 * @param schema
 * The actual JSON schema object.
 * @param idToSchema
 * A map, mapping JSON schema ids to the matching JSON schema object.
 * @returns
 * A promise that will trigger on operation completion or error.
 */
async function processSchema(
    absoluteFilePath: string,
    schema: Record<string, unknown>,
    idToSchema: Map<string, Record<string, unknown>>,
    idToImportPath: Map<string, string>,
): Promise<void> {
    //Generate interface code for this schema.
    const code: string = await createInterfaceCode(
        schema,
        idToSchema,
        idToImportPath,
    );

    //If no code, then there is no file to write.
    if (code.length <= 0) {
        return;
    }

    //Generate file path for this interface.
    const outputFilePath: string = createOutputPath(absoluteFilePath);

    //Write the module with the interface.
    await writeModule(outputFilePath, code);
}

//Catch anything that goes wrong.
try {
    //Load the schemas.
    const absoluteFilePathToSchema: Map<
        string,
        Record<string, unknown>
    > = await readJSONGlob(inputPattern);

    //Create a map, mapping all schema ids to the matching schema.
    const idToSchema: Map<string, Record<string, unknown>> = toIdToSchemaMap(
        absoluteFilePathToSchema.values(),
    );

    //Create a map, mapping all schema objects to their import paths.
    const idToImportPath: Map<string, string> = createIdToImportPath(
        absoluteFilePathToSchema,
    );

    //Array of processing promises we need to wait on.
    const processPromises: Promise<void>[] = [];

    //Iterate all the schemas.
    for (const [absoluteFilePath, schema] of absoluteFilePathToSchema) {
        //Create promise that will handle
        //converting schema to a TypeScript interface.
        const processPromise: Promise<void> = processSchema(
            absoluteFilePath,
            schema,
            idToSchema,
            idToImportPath,
        );

        //Save to array of process promises.
        processPromises.push(processPromise);
    }

    //Wait for all process promises to finish.
    await Promise.all(processPromises);

    //If anything goes wrong, print it.
} catch (error) {
    console.log(error);
}
