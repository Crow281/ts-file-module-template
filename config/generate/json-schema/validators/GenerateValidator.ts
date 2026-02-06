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
import { Ajv } from "ajv";
import standaloneCode from "ajv/dist/standalone";

/**
 * Comment used to mark this as a generated file
 * and comment telling user where script was created.
 */
const generatedHeader: string = createGeneratedHeaderComment(import.meta.url);

/**
 * @returns
 * Source code for a generated JSON schema validation function.
 */
export function generateValidator(
    ajv: Ajv,
    schema: Record<string, unknown>,
): string {
    //First, gather the variables we need to assemble this code.
    //Get the string used to identify this schema
    const id: unknown = schema["$id"];

    //If type of id is anything other than string.
    if (typeof id !== "string") {
        //Fail.
        throw new TypeError(
            `Schema id ${id} was of type ${typeof id} instead of string.`,
        );
    }

    //Get the TypeScript Type name for the schema interface
    //we are creating a validation function for.
    const typeName = fromTitleToTypeName(schema);

    //Calculate the name the validation function should have.
    const validationFunctionName = `validate${typeName}`;

    //Use AJV to create the validation function module.
    const validationSourceCode: string = standaloneCode(
        ajv,

        //Map the name we want for the validate function to the id of the
        //schema it validates so that AJV knows which schema we want
        //a validate function for and what to rename it to when exporting it.
        {
            [validationFunctionName]: id,
        },
    );

    //Assemble the overall code.
    //We basically just need to mark this file as generated so it can easily be cleaned.
    const code: string = `/* eslint-disable */
// @ts-nocheck
/**
 * @ignore
 * @module
 */
//The above comments are necessary to disable
//ESLint, TypeScript Type Checking, and TypeDoc, in that order,
//since this is a generated file where I cannot reliably fix what
//the 1st two tools are complaining about
//and the TypeDoc is already in a separate file.

${generatedHeader}

${validationSourceCode}`;

    return code;
}
