/*
 * The MIT License
 *
 * Copyright 2026 Crow281.
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
import { createGeneratedHeaderComment } from "../../utils/CreateGeneratedHeaderComment";
import { fromTitleToTypeName } from "../json/schema/FromTitleToTypeName";

/**
 * Link to documentation for AJV's error object.
 */
const ajvErrorObjectLink: string = "https://ajv.js.org/api.html#error-objects";

/**
 * Comment used to mark this as a generated file
 * and comment telling user where script was created.
 */
const generatedHeader: string = createGeneratedHeaderComment(import.meta.url);

/**
 * Code to attempt importing the AJV error object if library AJV is available.
 */
const importErrorObjectCode: string = `//We need to temporarily disable es-lint right here,
//because having an error here really is optional.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore -- Import the true ErrorObject interface if AJV is available and do nothing if it isn't.
import type { ErrorObject as AjvErrorObject } from "ajv";`;

/**
 * Code to define the error if library AJV is NOT available.
 */
const standaloneErrorObjectCode: string = `/**
 * Reports one of the reasons JSON Schema validation failed.
 *
 * This interface is a self-contained equivalent to ajv's
 * {@link ${ajvErrorObjectLink} ErrorObject}
 * and is used if the AJV library isn't available.
 * @typeParam K
 * Type of the object identifying the error.
 * @typeParam P
 * Type of the params property, containing data about the error.
 * @typeParam S
 * Type of the schema property, which if set,
 * has a reference to the original schema object.
 */
interface StandaloneErrorObject<
    K extends string = string,
    P = Record<string, unknown>,
    S = unknown,
> {
    /**
     * Validation keyword.
     */
    keyword: K;

    /**
     * JSON Pointer to the location in the data instance (e.g. "/prop/1/subProp").
     */
    instancePath: string;

    /**
     * JSON Pointer to the location of the failing keyword in the schema.
     */
    schemaPath: string;

    /**
     * Object with additional information about error.
     * It can be used to generate custom error messages,
     * for example, in conjunction with the ajv-i18n package.
     *
     * See {@link https://ajv.js.org/api.html#error-parameters error parameters}
     * for more details.
     */
    params: P;

    /**
     * If error represented a "propertyNames" error,
     * this is set to the propertyName that had the error.
     */
    propertyName?: string;

    /**
     * The error message.
     */
    message?: string;

    /**
     * The value of the failing keyword in the schema.
     *
     * Contains the original schema that triggered the error.
     */
    schema?: S;

    /**
     * The object containing the keyword.
     */
    parentSchema?: Record<string, unknown>;

    /**
     * The data validated by the keyword.
     */
    data?: unknown;
}`;

/**
 * Code selecting the AJV ErrorObject interface if available
 * and the StandaloneErrorObject if not.
 */
const errorTypeCode: string = `/**
 * Defines the type of the objects used to report errors.
 * Uses the original AJV definition if available and a standalone definition if not.
 */
type ErrorObject = unknown extends AjvErrorObject
    ? StandaloneErrorObject
    : AjvErrorObject;`;

/**
 * To ensure that the schema interface's
 * type name doesn't collide with anything
 * else, use an alias.
 */
const schemaInterfaceAlias: string = "SchemaInterface";

/**
 *
 * @param typeName
 * Name of the interface being validated.
 *
 * Type is expected to be in a module of the same name
 * in the same folder.
 * @returns
 * Code to import typeName.
 */
function generateInterfaceImport(typeName: string): string {
    //Generate code that will import the type being validated.
    const code: string = `//Import the type being validated.
//Use an alias, ${schemaInterfaceAlias}, to make sure there is no name collision.
import { ${typeName} as ${schemaInterfaceAlias} } from "./${typeName}";`;

    return code;
}

/**
 * @param typeName
 * Name of the interface being validated.
 * @param validationFunctionName
 * Name of the validation function.
 * @returns
 * Code defining the validation function.
 */
function generateValidateFunction(
    typeName: string,
    validationFunctionName: string,
): string {
    //Generate code to represent the validation function.
    const code: string = `/**
 * @function
 * Checks whether a given value is a valid instance of
 * {@link ${schemaInterfaceAlias} ${typeName}} and matches its
 * {@link https://json-schema.org/ JSON Schema}.
 * @param {any} data
 * Value we want to check to see if it matches {@link ${schemaInterfaceAlias} ${typeName}}.
 * @returns {data is ${schemaInterfaceAlias}}
 * true if data is confirmed to be a valid instance of
 * type {@link ${schemaInterfaceAlias} ${typeName}}, false otherwise.
 *
 * If result is false, you may check property {@link ${validationFunctionName}#errors}
 * for an array of {@link ErrorObject}s to figure out whatever went wrong.
 * @example
 * This example shows you how you can verify that a
 * value matches type ${typeName}.
 * \`\`\`TypeScript
 * //A function that can only operate on ${typeName}.
 * //Will print it to the console.
 * function printObject(obj: ${typeName}): void {
 *     console.log(obj);
 * }
 *
 * //Some object we want to validate.
 * const obj: unknown = {
 *     someProperty: 25
 * };
 *
 * //If this object is a valid instance of ${typeName}.
 * if (${validationFunctionName}(obj)) {
 *     //We can use it as the type.
 *     printObject(obj);
 * }
 * \`\`\`
 */
declare const ${validationFunctionName}: {
    (data: unknown): data is ${schemaInterfaceAlias};

    /**
     * If the validation function returns false,
     * this property will be set to an array of {@link ErrorObject}s,
     * explaining why validation failed.
     *
     * If your project contains
     * {@link https://www.npmjs.com/package/ajv package ajv},
     * then
     * this function will use
     * {@link ${ajvErrorObjectLink} AJV's interface}
     * for them.
     * If not, it will use an internal and independant interface,
     * {@link StandaloneErrorObject},
     * to define them. Note that there is no runtime difference
     * between the two types.
     * @example
     * This example shows you how to fetch the resulting
     * {@link ErrorObject}
     * array if something goes wrong during validation.
     * \`\`\`TypeScript
     * //Some object we want to validate.
     * const obj: unknown = {
     *     someProperty: 25
     * };
     *
     * //If this object is NOT a valid instance of ${typeName}.
     * if (!${validationFunctionName}(obj)) {
     *     //Tell user validation failed.
     *     console.log("Obj is NOT an instance of ${typeName}");
     *
     *     //Fetch the list of errors.
     *     const errors = ${validationFunctionName}.errors;
     * 
     *     //By default, the error messages are in English.
     *     //Use ajv-i18n to localize the error messages.
     *     //This localize function was imported from "ajv-i18n/localize/fr"
     *     //and will translate the error messages to French.
     *     localize(errors);
     *
     *     //Iterate the errors.
     *     for (const error of errors) {
     *         //Print the error representing whatever went wrong.
     *         console.log(error);
     *     }
     * }
     * \`\`\`
     */
    errors?: null | ErrorObject[];
};`;

    return code;
}

/**
 * @param schema
 * Schema object the validate function validates.
 * @returns
 * Code defining the validate function.
 */
export function generateDefinition(schema: Record<string, unknown>): string {
    //Fetch data we need for definitions.
    //Get the TypeScript Type name for the schema interface
    //we are creating a validation function for.
    const typeName = fromTitleToTypeName(schema);

    //Calculate the name the validation function should have.
    const validationFunctionName = `validate${typeName}`;

    //Code to import interface being validated.
    const typeImportCode: string = generateInterfaceImport(typeName);

    //Code defining the validate function itself.
    const validateFunctionCode: string = generateValidateFunction(
        typeName,
        validationFunctionName,
    );

    //Overall code of the definition file.
    const code: string = `${generatedHeader}
${typeImportCode}
${importErrorObjectCode}

${standaloneErrorObjectCode}

${errorTypeCode}

${validateFunctionCode}
`;

    return code;
}
