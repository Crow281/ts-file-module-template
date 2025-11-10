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
 * Scans source folder and deletes any JavaScript/TypeScript files
 * that were dynamically generated.
 */
import { GENERATED_HEADER } from "./utils/GeneratedHeader";
import { glob } from "glob";
import { createReadStream, promises as filePromises } from "node:fs";

/**
 * Glob path leading to where all generated files are located.
 */
const sourceFilesGlob: string = "src/**/*.{js,ts,jsonc,json5}";

/**
 * The header of all generated files in byte form as utf-8 bytes.
 */
const GENERATED_HEADER_BUFFER: Buffer = Buffer.from(GENERATED_HEADER, "utf-8");

/**
 * Reads the first few bytes of a file.
 * @param filePath
 * File we want to read.
 * @param length
 * How many bytes of the file we want to read.
 * @returns
 * A buffer containing {length} bytes of the file.
 */
function readFirstBytes(filePath, length) {
    //Task for promise to run.
    const executor = (
        resolve: (value: Buffer) => void,
        reject: (reason?: unknown) => void,
    ) => {
        //Used to store the results.
        const chunks: Buffer[] = [];

        //Start reading in the stream.
        const stream = createReadStream(filePath, {
            start: 0,
            end: length - 1,
        });

        //Whenever the stream receives data, store it.
        //Since we didn't pass any encoding, it will be as a buffer.
        stream.on("data", (chunk: Buffer | string): void => {
            chunks.push(chunk as Buffer);
        });

        //When done reading file.
        stream.on("end", () => {
            //Combine byte buffers and send them to user.
            resolve(Buffer.concat(chunks));
        });

        //If something goes wrong, pass it to promise.
        stream.on("error", (error): void => {
            reject(error.message);
        });
    };

    return new Promise<Buffer>(executor);
}

/**
 *
 * @param filePath
 * Path to file we want to check.
 * @returns
 * true if the given file path is a generated source file.
 */
async function isGeneratedScript(filePath): Promise<boolean> {
    //First, check byte size of file.
    const stats = await filePromises.stat(filePath);

    //If file size is too small to contain header, it isn't generated.
    if (stats.size < GENERATED_HEADER_BUFFER.length) {
        return false;
    }

    //Read in the beginning of the file.
    const fileHeaderBuffer: Buffer = await readFirstBytes(
        filePath,
        GENERATED_HEADER_BUFFER.length,
    );

    //If the beginning of the file matches the desired header,
    //this must be a generated script.
    return fileHeaderBuffer.equals(GENERATED_HEADER_BUFFER);
}

/**
 * Deletes the file at the given path if it is a generated script.
 * @param filePath
 * File path we want to check.
 */
async function deleteGeneratedScript(filePath): Promise<void> {
    //Check whether the file path in question refers to a generated script.
    const isGenerated: boolean = await isGeneratedScript(filePath);

    //If this is a generated file.
    if (isGenerated) {
        //Delete it.
        await filePromises.unlink(filePath);
    }
}

try {
    //Get paths to all source files.
    const sourceFilePaths: string[] = await glob(sourceFilesGlob, {
        //Which files that would otherwise fit that this should skip.
        ignore: [
            //Exclude all test folders from the build.
            "**/__tests__/**",

            //Exclude definition files.
            "**/*.d.ts",
        ],
    });

    //List of promises that need to finish before script is done.
    const promises: Promise<void>[] = [];

    //Iterate the source files.
    for (const sourceFilePath of sourceFilePaths) {
        //Check if this is a generated script and delete it if so.
        const promise = deleteGeneratedScript(sourceFilePath);

        //Add to list of promises we are waiting on.
        promises.push(promise);
    }

    //Complete when all promises are finished.
    await Promise.all(promises);

    //If anything goes wrong, print it.
} catch (error) {
    console.error(error);
}
