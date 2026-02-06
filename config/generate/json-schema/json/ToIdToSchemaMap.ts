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
 *
 * @param schemas
 * List of JSON schema we want mappings for.
 * @returns
 * Maps JSON schema ids to corresponding schema.
 */
export function toIdToSchemaMap(
    schemas: IterableIterator<Record<string, unknown>>,
): Map<string, Record<string, unknown>> {
    //Map we are creating.
    const idToSchema: Map<string, Record<string, unknown>> = new Map();

    //Iterate the schema.
    for (const schema of schemas) {
        //Fetch id.
        const id: unknown = schema["$id"];

        //If it has an id and has the correct type.
        if (typeof id === "string") {
            //Check if id has already been used.
            const oldSchema: object | undefined = idToSchema.get(id);

            //If multiple schema use the same id.
            if (oldSchema !== undefined) {
                //Fire an error.
                throw new Error(
                    `Multiple schema files are using the same id, "${id}"`,
                );
            }

            //Save the new mapping.
            idToSchema.set(id, schema);
        }
    }

    return idToSchema;
}
