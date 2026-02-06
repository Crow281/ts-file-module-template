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
 * @param schema
 * The schema we want to generate a TypeName for.
 * @returns
 * TypeName we should pick for this schema.
 *
 * Will return the schema's title.
 * @throws {TypeError}
 * If schema.title is anything other than string.
 * @throws {Error}
 * If schema.title.length is <= 0.
 */
export function fromTitleToTypeName(schema: Record<string, unknown>): string {
    //Get the title for the schema interface
    //we are creating a validation function for.
    const title = schema["title"];

    //If type of title is anything other than string.
    if (typeof title !== "string") {
        //Fail.
        throw new TypeError(
            `Schema title ${title} was of type ${typeof title} instead of string.`,
        );
    }

    //If title is empty, fail.
    if (title.length <= 0) {
        throw new Error("Schema title is empty.");
    }

    return title;
}
