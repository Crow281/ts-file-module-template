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
 * Then it creates an internal module inside of outputFilePath
 * containing a single constant object, mapping
 * Schema Id strings to the matching JSON constant contained
 * in the corresponding JSON Schema file.
 */
import { createGeneratedHeaderComment } from "../utils/CreateGeneratedHeaderComment";
import { getLicenseComment } from "../utils/GetLicenseComment";
import { ImportFactory, ImportReflection } from "../utils/ImportFactory";
import { inputToOutputPath } from "../utils/InputToOutputPath";
import { readJSONGlob } from "../utils/json/ReadJSONGlob";
import { toIdToPathMap } from "../utils/json/ToIdToPathMap";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname } from "node:path";

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
 * Name of the variable we are exporting.
 */
const varName: string = "ID_TO_JSON_SCHEMA";

/**
 * Module path we are writing to.
 *
 * The full import is "internal/IDToJSONSchema".
 */
const outputImport: string = "internal/IDToJSONSchema";

/**
 * Place we will write the resulting file to.
 */
const outputFilePath: string = "./src/internal/IDToJSONSchema.ts";

//Comment used to mark this as a generated file
//and comment telling user where script was created.
const generatedHeader: string = createGeneratedHeaderComment(import.meta.url);

//Fetch license text.
const licenseText: string = await getLicenseComment();

//Combined header source.
const fullHeader: string = `${generatedHeader}
${licenseText}`;

/**
 * Generates the import for each Schema file.
 * Ensures that none of the schema files share the same id.
 * Ensures that none of the schema constants inside
 * the files use the same import alias.
 * @param absoluteFilePathToSchema
 * Map mapping absolute file paths to schema in them.
 * @param importFactory
 * Object used to manage imports.
 * @returns
 * List of tuples containing schema JSON objects and matching import.
 */
function createSchemaImportMapping(
    absoluteFilePathToSchema: Map<string, object>,
    importFactory: ImportFactory,
): [object, ImportReflection][] {
    //Convert to a map, mapping schema ids to their file paths.
    //The map is primarily just to ensure no duplicate schema ids
    //and no empty schema ids.
    const idToAbsolutePath: Map<string, string> = toIdToPathMap(
        absoluteFilePathToSchema,
    );

    //Array of entries, mapping schema ids to the var name
    //holding the matching json schema.
    const idToSchemaConstants: [object, ImportReflection][] = [];

    //Iterate the schemas.
    for (const absoluteFilePath of idToAbsolutePath.values()) {
        //Fetch schema associated with this file path.
        const schema: object | undefined =
            absoluteFilePathToSchema.get(absoluteFilePath);

        //If schema somehow doesn't exist, fail.
        if (schema === undefined) {
            throw new Error(
                `Could not locate schema at path ${absoluteFilePath}`,
            );
        }

        //Calculate the absolute path used to import this JSON schema.
        const absoluteImportPath: string = inputToOutputPath(
            inputRoot,
            "",
            absoluteFilePath,
        );

        //Figure out what we are going to call the
        //constant variable stored within the json file.
        //Use the file name without the extension.
        const varName: string = basename(absoluteImportPath, ".schema.json");

        //Calculate how to import this JSON constant.
        const importReflection: ImportReflection = importFactory.import(
            absoluteImportPath,
            varName,
            //Use false since it is a constant, not a type.
            false,
            //Since we are importing directly out of JSON files,
            //we are using the default import.
            true,
        );

        //Store this schema to import pair.
        idToSchemaConstants.push([schema, importReflection]);
    }

    return idToSchemaConstants;
}

/**
 * Creates the code filling the constant object literal.
 * @param schemaToImports
 * Array of tuples, each containing a JSON Schema object and its import.
 * @returns
 * String containing code for properties of object literal,
 * containing schema ids being mapped to the matching JSON schema objects.
 */
function createPropertyCode(
    schemaToImports: [object, ImportReflection][],
): string {
    //Create array to hold code for each property of the mapping.
    const propertyCodes: string[] = Array(schemaToImports.length);

    //Iterate all the mappings.
    for (let index: number = 0; index < schemaToImports.length; ++index) {
        //Fetch current mapping we are operating on.
        const schemaToImport = schemaToImports[index];

        //Fetch schema.
        const schema: object = schemaToImport[0];

        //Fetch schema id.
        const schemaId: string = schema["$id"];

        //Fetch schema description (if any).
        const schemaDescription: string | undefined = schema["description"];

        //Fetch schema constant's import.
        const schemaConstant: ImportReflection = schemaToImport[1];

        //Ensure any special characters in schema id are escaped.
        const schemaIdCode: string = JSON.stringify(schemaId);

        //Fetch the name of the import.
        const constVarName: string = schemaConstant.aliasName;

        //Create code, mapping schema id to constant var holding the schema.
        //Use 4 spaces for 1 indent.
        propertyCodes[index] = `    /**
     * A JSON object containing the
     * {@link https://json-schema.org/ JSON Schema}
     * this id represents.
     *
     * ${schemaDescription}
     */
    ${schemaIdCode}: ${constVarName} as Record<
        string,
        unknown
    >,`;
    }

    //Combine all the lines of code.
    const propertyCode: string = propertyCodes.join("\n\n");

    return propertyCode;
}

//Catch anything that goes wrong.
try {
    //Load the schemas.
    const absoluteFilePathToSchema: Map<string, object> =
        await readJSONGlob(inputPattern);

    //Create object to manage imports.
    const importFactory: ImportFactory = new ImportFactory();

    //Generate import objects for each schema constant.
    const schemaToImports: [object, ImportReflection][] =
        createSchemaImportMapping(absoluteFilePathToSchema, importFactory);

    //Generate code for importing all the JSON schema constants from the file.
    const importCode: string = importFactory.toCode(outputImport);

    //Generate code for each of the id to schema mappings.
    const propertyCode: string = createPropertyCode(schemaToImports);

    //Create constant variable pointing to an object that maps
    //schema ids to matching schema.
    const mappingCode: string = `export const ID_TO_JSON_SCHEMA = {
${propertyCode}
} as const;`;

    //Create the overall code.
    //Generated header to mark this as a generated file,
    //licenseText to put in the license,
    //importCode to import the necessary modules,
    //and finally the constant object itself.
    const code: string = `${fullHeader}
${importCode}

/**
 * A constant, mapping JSON Schema ids to the JSON Schema
 * as a JSON object.
 */
${mappingCode}
`;

    //Make sure the folder we want to put code in exists.
    await mkdir(dirname(outputFilePath), {
        recursive: true,
    });

    //Write the new TypeScript file.
    await writeFile(outputFilePath, code, {
        encoding: "utf-8",
    });

    //If anything goes wrong.
} catch (error) {
    //Print whatever went wrong.
    console.log(error);
}
