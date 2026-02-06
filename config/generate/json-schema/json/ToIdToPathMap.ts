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
 * @param pathToSchema
 * A map, mapping paths to the schema at the path.
 * @returns
 * A map, mapping schema ids to the path it is located at.
 */
export function toIdToPathMap(
    pathToSchema: Map<string, Record<string, unknown>>,
): Map<string, string> {
    //Map, mapping all schema ids used so far to the path using it.
    const idToPath: Map<string, string> = new Map();

    //Iterate the schemas.
    for (const [path, schema] of pathToSchema) {
        //Fetch schema id.
        const id: unknown = schema["$id"];

        //If the schema has no id.
        if (!id) {
            //Ignore it.
            continue;
        }

        //If the schema's id is not a string.
        if (typeof id !== "string") {
            //Throw an error.
            throw new TypeError(`${path} $id has unexpected type ${typeof id}`);
        }

        //Check if id has already been used.
        const oldPath: string | undefined = idToPath.get(id);

        //If multiple schema use the same id.
        if (oldPath !== undefined) {
            //Fire an error.
            throw new Error(
                `Multiple schema files are using the same id, "${id}":
${oldPath}
${path}`,
            );
        }

        //Save the new mapping.
        idToPath.set(id, path);
    }

    return idToPath;
}
