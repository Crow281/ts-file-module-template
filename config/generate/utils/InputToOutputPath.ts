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
import { basename, dirname, extname, join, relative } from "node:path";

/**
 *
 * @param basename
 * Name of the file without directories.
 * @returns
 * The full file extension of the given file.
 * Empty string if none.
 */
function getFileExtension(basename: string): string {
    //Get index of the first period, defining extension.
    const periodIndex: number = basename.indexOf(".");

    //If it has an extension.
    if (periodIndex >= 0) {
        return basename.substring(periodIndex);

        //If no file extension.
    } else {
        //Return an empty string.
        return "";
    }
}

/**
 * Options to customize transformation.
 */
export interface Options {
    /**
     * Modifies directory.
     * @param oldDir
     * The original dir output would have been directed to.
     * @returns
     * The new dir output should be directed to.
     */
    transformDir?: (oldDir: string) => string;

    /**
     * Modifies basename.
     */
    transformBaseName?: (oldBaseName: string) => string;

    /**
     * New file extension.
     */
    transformFileExtension?: (oldFileExtension: string) => string;
}

/**
 * If user is operating on an input and output directory
 * with the same relative file paths,
 * this function eases converting between input file paths
 * to their output file paths.
 * @param rootInputPath
 * Base directory of the inputs.
 * Is used to determine the relative paths.
 * @param rootOutputPath
 * Base directory of the outputs.
 * The relative paths are appended to it.
 * @param inputPath
 * The path to the original file we were using as input.
 * @param options
 * Customizes how stuff is transformed, such as file extension.
 * @returns
 * File path we want to output to.
 */
export function inputToOutputPath(
    rootInputPath: string,
    rootOutputPath: string,
    inputPath: string,
    options?: Options,
): string {
    //Get the original input path relative to its root directory.
    const relativePath: string = relative(rootInputPath, inputPath);

    //Add the relative path to the output path to
    //get the path to the output.
    const outputPathWithOldExtension: string = join(
        rootOutputPath,
        relativePath,
    );

    //If no options were selected.
    if (!options) {
        //Then we don't need to transform the output path.
        return outputPathWithOldExtension;
    }

    //Get the directory the file will be output to.
    let dir: string = dirname(outputPathWithOldExtension);

    //If user wants to transform the directory.
    if (options.transformDir) {
        //Transform the directory.
        dir = options.transformDir(dir);
    }

    //Get the file's base name.
    const baseNameWithExtension: string = basename(outputPathWithOldExtension);

    //Fetch the old file extension.
    const oldFileExtension: string = getFileExtension(baseNameWithExtension);

    //Get the base name without the file extension.
    let baseName: string = baseNameWithExtension.substring(
        0,
        baseNameWithExtension.length - oldFileExtension.length,
    );

    //If user wants to transform the base name.
    if (options.transformBaseName) {
        //Transform the base name
        baseName = options.transformBaseName(baseName);
    }

    //The file extension for the result.
    let newFileExtension: string;

    //If user wants to transform the file extension.
    if (options.transformFileExtension) {
        //Transform the file extension.
        newFileExtension = options.transformFileExtension(oldFileExtension);

        //If not selected.
    } else {
        //Use the old file extension.
        newFileExtension = oldFileExtension;
    }

    //Assemble the file path.
    let outputPath: string = join(dir, baseName);

    //Add the file extension.
    if (newFileExtension.length > 0) {
        outputPath += "." + newFileExtension;
    }

    return outputPath;
}
