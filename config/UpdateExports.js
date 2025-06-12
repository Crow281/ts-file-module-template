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
 * This script reads in the NPM package's package.json file
 * and the list of source files and
 * uses that data to update its exports field.
 * 
 * It will mark all modules with any parent folders named "internal"
 * as null, preventing access.
 * 
 * However, if the exports field has preexisting "internal"
 * exports set to anything other than null, it will not update them.
 */
import { globSync } from "glob";
import {
    readFileSync,
    writeFileSync
} from "fs";
import * as path  from "node:path";

//Fetch a copy of the commandline arguments and convert them to a set.
//Skip the first 2 arguments of the argv array
//since they refer to stuff we don't care about,
//namely the location of Node and the location of this script.
//const args = new Set(process.argv.slice(2));

//URL pointing to the NPM project's package.
const npmPackageURL = new URL("../package.json", import.meta.url);

/**
 * Function that runs the overall script.
 * @returns 
 */
function run() {
    //Read the NPM project's package.json so we can get configuration data.
    const npmPackage = JSON.parse(readFileSync(
        npmPackageURL,
        "utf8"
    ));

    //Get list of all internal source file paths.
    const internalSourceFilePaths = globSync(
        "./src/**/internal/**/*.{ts,tsx,js,jsx}",
        {
            ignore: [
                //Exclude all test folders from the build.
                "**/__tests__/**"
            ]
        }
    );

    //Stores collection of all folder paths relative to "src"
    //with an "internal" in the folder heirarchy
    //containing source files.
    //This is a set to avoid adding the same folder multiple times.
    const internalSourceFolderPathsSet = new Set();

    //Fill sourceFolderPaths with the folder paths.
    for (const internalSourceFilePath of internalSourceFilePaths) {
        //Convert the file path to a suitable module folder,
        //cutting off the base directory of "src" and the file.
        //For example,
        //"{projectPath}/src/folder/TestFile.js" becomes "folder"
        const folderPath = path.relative(
            "src",
            //Cut off the file path.
            path.dirname(internalSourceFilePath)
        );

        //Record folder to the set.
        internalSourceFolderPathsSet.add(folderPath);
    }

    //Convert set of source folder paths to an array.
    const internalSourceFolderPaths = Array.from(internalSourceFolderPathsSet);

    //Sort paths alphabetically.
    internalSourceFolderPaths.sort();

    //Fetch the exports object in package.json.
    const exports = npmPackage.exports;

    //If exports object does not already exist.
    if (!exports) {
        //Create it and initialize it to some default values.
        exports = {
            //Automatically provides access to importing package.json.
            "./package.json": "./package.json",
        
            //Allows all other modules to be imported via their file path name.
            //For example, "src/SomeFolder/SomeFile.ts"
            //is imported as "SomeFolder/SomeFile".
            "./*": {
                //We can get the module's types by accessing
                //the dist folder, appending the module path,
                //and then appending the definition file extension.
                "types": "./dist/*.d.ts",
        
                //We can get the module's CommonJs Module build by accessing
                //the dist folder, appending the module path,
                //and then appending the CommonJS Module file extension.
                "require": "./dist/*.cjs",
        
                //We can get the module's ES Module build by accessing
                //the dist folder, appending the module path,
                //and then appending the ES Module file extension.
                "import": "./dist/*.mjs"
            }
        };

        //Save it to npm package.
        npmPackage.exports = exports;
    }

    //Erase the original list of "internal" folders so we can
    //enforce ordering and remove any that no longer exist.
    //A regular expression that tests if a file path has
    //an "internal" folder anywhere in it.
    const internalRegExp = /(^|\/)internal(\/|$)/;

    //Get the old list of export keys.
    const oldExportKeys = Object.keys(exports);

    //Delete any keys corresponding to "internal" folders.
    for (const exportKey of oldExportKeys) {
        //If this export key does NOT have an internal folder.
        if (!internalRegExp.test(exportKey)) {
            //Notify user that we did not update this line because
            //it is not internal
            console.log(
                "Skipping update of export \"" +
                exportKey +
                "\" because it is not internal."
            );

            //Skip this export.
            continue;
        }

        //Check if this key's value is actually null.
        //If not, assume that the user did something custom
        //and leave it be.
        if (exports[exportKey] !== null) {
            //Notify user that we did not update this line because
            //it appears to be custom.
            console.log(
                "Skipping update of export \"" +
                exportKey +
                "\" because it is set to a non-null value, " +
                "implying it was hand set by the user."
            );

            //Skip this export.
            continue;
        }

        //Since this was simply blocking export as expected,
        //erase it from the exports object.
        delete exports[exportKey];
    }

    //Iterate the new list of internal source folders.
    for (const internalSourceFilePath of internalSourceFolderPaths) {
        //Key we are setting.
        const key = "./" + internalSourceFilePath;

        //Skip if key already exists, meaning we should not overwrite it.
        if (exports[key]) {
            continue;
        }

        //Disable access to this entry point by setting it to null.
        exports[key] = null;
    }

    //Convert the NPM package back into text.
    const npmPackageText = JSON.stringify(
        //The NPM package JSON object.
        npmPackage,

        //Don't need to replace anything.
        null,

        //Use 4 spacing indents.
        4
    );

    //Replace the old npm package file with the one with new exports.
    writeFileSync(
        npmPackageURL,
        npmPackageText
    );
}

//Call the script.
run();
