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
 * and replaces its exports field with a default value:
 * ```json
 * {
 *     "./package.json": "./package.json",
 *     "./*": {
 *         "types": "./dist/*.d.ts",
 *         "require": "./dist/*.cjs",
 *         "import": "./dist/*.mjs"
 *     },
 * }
 * ```
 */
import { readFileSync, writeFileSync } from "fs";

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
    const npmPackage = JSON.parse(readFileSync(npmPackageURL, "utf8"));

    //Set the exports object to the project's default state for it.
    npmPackage.exports = {
        //Automatically provides access to importing package.json.
        "./package.json": "./package.json",

        //Allows all other modules to be imported via their file path name.
        //For example, "src/SomeFolder/SomeFile.ts"
        //is imported as "SomeFolder/SomeFile".
        "./*": {
            //We can get the module's types by accessing
            //the dist folder, appending the module path,
            //and then appending the definition file extension.
            types: "./dist/*.d.ts",

            //We can get the module's CommonJs Module build by accessing
            //the dist folder, appending the module path,
            //and then appending the CommonJS Module file extension.
            require: "./dist/*.cjs",

            //We can get the module's ES Module build by accessing
            //the dist folder, appending the module path,
            //and then appending the ES Module file extension.
            import: "./dist/*.mjs",
        },
    };

    //Convert the NPM package back into text.
    const npmPackageText = JSON.stringify(
        //The NPM package JSON object.
        npmPackage,

        //Don't need to replace anything.
        null,

        //Use 4 spacing indents.
        4,
    );

    //Replace the old npm package file with the one with new exports.
    writeFileSync(npmPackageURL, npmPackageText);
}

//Call the script.
run();
