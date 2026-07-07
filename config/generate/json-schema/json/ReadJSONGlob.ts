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
import { readJSONFile } from "./ReadJSONFile";
import { glob } from "node:fs/promises";

/**
 * Loads all files referred to by the given glob pattern
 * as json objects.
 * @param inputPattern
 * Glob pattern to all UTF-8 JSON files that are to be loaded.
 * @returns
 * A map, mapping file paths to the JSON objects stored to them.
 */
export async function readJSONGlob(
    inputPattern: string,
): Promise<Map<string, Record<string, unknown>>> {
    //Map to hold the schema objects.
    const filePathToObject: Map<string, Record<string, unknown>> = new Map();

    //Get the file paths to the JSON files.
    const filePathsIterator: NodeJS.AsyncIterator<string> =
        await glob(inputPattern);

    //Allocate array to store all the promises that need to finish.
    const promises: Promise<void>[] = [];

    //Iterate the file paths.
    for await (const filePath of filePathsIterator) {
        //Read in this file path.
        const filePromise: Promise<Record<string, unknown>> =
            readJSONFile(filePath);

        //Upon completion, map the entry to its file path.
        const storePromise: Promise<void> = filePromise.then(
            (jsonObject: Record<string, unknown>): void => {
                //Store to the map of paths to json objects.
                filePathToObject.set(filePath, jsonObject);
            },
        );

        //Store to the list of promises we will be waiting on.
        promises.push(storePromise);
    }

    //Wait for all operations on all files to complete.
    await Promise.all(promises);

    return filePathToObject;
}
