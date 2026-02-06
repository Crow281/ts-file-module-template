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
import { GENERATED_HEADER } from "../utils/GeneratedHeader";
import { glob } from "glob";
import { readFile, readdir, rmdir, stat, unlink } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * List of generated scripts that this can detect.
 */
const extensions: string = "{cjs,d.ts,js,jsonc,json5,mjs,ts}";

/**
 * Glob path leading to where all generated files are located.
 */
const externalSourceFilesGlob: string = `src/**/*.${extensions}`;

/**
 * Glob path leading to where all generated internal files are located.
 */
const internalSourceFilesGlob: string = `src/**/internal/**/*.${extensions}`;

/**
 * The header of all generated files in byte form as utf-8 bytes.
 */
const GENERATED_HEADER_BUFFER: Buffer = Buffer.from(GENERATED_HEADER, "utf-8");

/**
 * Function allowing us to check if a given file path contains a generated script.
 * @param filePath
 * Path to file we want to check.
 * @returns
 * true if the given file path is a generated source file.
 */
async function isGeneratedScript(filePath: string): Promise<boolean> {
    //First, check byte size of file.
    const stats = await stat(filePath);

    //If file size is too small to contain header, it isn't generated.
    if (stats.size < GENERATED_HEADER_BUFFER.length) {
        return false;
    }

    //Read in the file being checked.
    const fileBuffer: Buffer = await readFile(filePath);

    //Locate the generated header.
    const headerIndex: number = fileBuffer.indexOf(GENERATED_HEADER_BUFFER);

    //If result is less than zero meaning it does not exist.
    if (headerIndex < 0) {
        //Return that it does not exist.
        return false;
    }

    //If header exists, this is a generated script.
    return true;
}

/**
 * Deletes the file at the given path if it is a generated script.
 * @param filePath
 * File path we want to check.
 */
async function deleteGeneratedScript(filePath: string): Promise<void> {
    //Check whether the file path in question refers to a generated script.
    const isGenerated: boolean = await isGeneratedScript(filePath);

    //If this is a generated file.
    if (isGenerated) {
        //Delete it.
        await unlink(filePath);
    }
}

/**
 *
 * @param sourceFilePaths
 * Array of files to check and delete if a generated script.
 * @returns
 * A promise that will finish upon deleting all generated scripts.
 */
function deleteGeneratedScripts(sourceFilePaths: string[]): Promise<void[]> {
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
    return Promise.all(promises);
}

/**
 *
 * @param dirPath
 * Path to the directory we want to count the files in.
 * @returns
 * A promise that will return the number of files upon completion.
 */
async function countDirFiles(dirPath: string): Promise<number> {
    //Fetch the list of files in the dir.
    const files: string[] = await readdir(dirPath);

    //Pass back their number.
    return files.length;
}

/**
 * Deletes the given directory if it is empty.
 * @param dirPath
 * Dir path we are deleting.
 * Will do nothing if dir is empty.
 * @returns
 * A promise representing the state of running this operation.
 */
async function deleteDirPathIfEmpty(dirPath: string): Promise<void> {
    //Get number of files in the folder.
    const fileCount: number = await countDirFiles(dirPath);

    //If the folder it was in is now empty, delete that folder.
    if (fileCount <= 0) {
        //TODO: Print the results before uncommenting the below line to make sure it works right.
        await rmdir(dirPath);
    }
}

/**
 * Deletes any empty parent folders for all of the given paths.
 * @param sourceFilePaths
 * Array of files we want to delete their parent folders for if empty.
 * @returns
 * A promise that will finish upon deleting all empty file parents.
 */
function deleteEmptyParentFolders(sourceFilePaths: string[]): Promise<void[]> {
    //Set of all parent folders.
    const dirPathSet: Set<string> = new Set();

    //Iterate all of the file paths.
    for (const sourceFilePath of sourceFilePaths) {
        //Get the path to the directory that formerly contained this file.
        const dirPath: string = dirname(sourceFilePath);

        //Add to the set.
        dirPathSet.add(dirPath);
    }

    //List of promises that need to finish before script is done.
    const promises: Promise<void>[] = [];

    //Iterate all of the folder paths.
    for (const dirPath of dirPathSet) {
        //Delete this folder if empty.
        const promise: Promise<void> = deleteDirPathIfEmpty(dirPath);

        //Add to list of promises we are waiting on.
        promises.push(promise);
    }

    //Complete when all promises are finished.
    return Promise.all(promises);
}

//Catch anything that goes wrong.
try {
    //Get paths to all non-internal source files.
    const exportedSourceFilePaths: string[] = await glob(
        externalSourceFilesGlob,
        {
            //Which files that would otherwise fit that this should skip.
            ignore: [
                //Exclude all test folders from the build.
                "**/__tests__/**",

                //Exclude internal source files.
                internalSourceFilesGlob,
            ],
        },
    );

    //Get paths to all internal source files.
    const internalSourceFilePaths: string[] = await glob(
        internalSourceFilesGlob,
        {
            //Which files that would otherwise fit that this should skip.
            ignore: [
                //Exclude all test folders from the build.
                "**/__tests__/**",
            ],
        },
    );

    //Create combined array of all generated scripts.
    const sourceFilePaths: string[] = [
        ...exportedSourceFilePaths,
        ...internalSourceFilePaths,
    ];

    //Delete all generated scripts.
    await deleteGeneratedScripts(sourceFilePaths);

    //Now delete any internal script parent folders that have become empty because of this.
    await deleteEmptyParentFolders(internalSourceFilePaths);

    //If anything goes wrong, print it.
} catch (error) {
    console.error(error);
}
