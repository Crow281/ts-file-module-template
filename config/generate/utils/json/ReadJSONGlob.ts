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
import { readJSONFiles } from "./ReadJSONFiles";
import { glob } from "glob";

/**
 *
 * @param inputPattern
 * Glob pattern to all UTF-8 JSON files that are to be loaded.
 * @returns
 * A map, mapping absolute file paths to the JSON objects stored to them.
 */
export async function readJSONGlob(
    inputPattern: string,
): Promise<Map<string, object>> {
    //Get the file paths to the JSON files.
    const filePaths: string[] = await glob(inputPattern);

    //Load all of the JSON files into objects.
    //The result will have the same order as parameter file paths.
    const jsonObjects: any[] = await readJSONFiles(filePaths);

    //Map to hold the schema objects.
    const filePathToObject: Map<string, any> = new Map();

    //Map the file paths to the object they load.
    for (let index: number = 0; index < filePaths.length; ++index) {
        //Map the schema to its file path.
        filePathToObject.set(filePaths[index], jsonObjects[index]);
    }

    return filePathToObject;
}
