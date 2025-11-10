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
 * rollup.config.mjs
 *
 * Configuration file for Rollup,
 * telling it how to build the project.
 *
 * This will load a list of all TypeScript and JavaScript files,
 * as well as any json and css files they import,
 * from folder "{project}/src", and build them to folder "{project}/dist".
 */
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import dsv from "@rollup/plugin-dsv";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import { globSync } from "glob";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import includePaths from "rollup-plugin-includepaths";

//Since rollup.config.mjs is inside {project}/config/build,
//src is in {project}/src, and the script is called from
//{project}, sometimes src needs to be relative to the config file's location,
//and other times it needs to be relative to {project}'s location

//List of plugins all modules use that don't need custom configuration.
const modulePlugins = [
    //Makes it possible to import modules using src as the base path.
    includePaths({
        paths: ["src", "generated/src"],
        extensions: [".json", ".csv", ".tsx", ".js", ".jsx", ".ts", ".tsv"],
    }),
    //Allows searching 3rd party modules.
    nodeResolve({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    //Makes it possible to convert CSV and TSV files into Javascript objects
    //and import them.
    dsv(),
    //Converts json and json5 files to ES6 modules.
    json({
        preferConst: true,
        compact: false,
        namedExports: false,
    }),
    //Converts CommonJS modules into ES modules.
    commonjs(),
    //Ensures backwards compatibility
    babel({
        //Tell babel where to find the config file.
        configFile: "./config/build/babel.config.json",
        //Import babel by bundling it directly into the build.
        babelHelpers: "bundled",
        //Don't need to embed anything inside of node_modules.
        exclude: ["**/node_modules/**", "**/__tests__/**"],
        //Types of files to transpile.
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
];

/**
 * Stores a new key value pair to input.
 * Triggers a warning if the key already exists.
 * @param {any} input
 * input object mapping entry points to source paths.
 * @param {string} key
 * Entry point with value we are setting.
 * @param {string} value
 * New value of the entry point.
 */
function setEntryValue(input, key, value) {
    //If key already exists.
    if (input[key]) {
        //Log that multiple have been detected.
        console.warn(
            "Entries can only be mapped to 1 path.\n" +
                "When there are more, it will use the most recent.\n" +
                `Changing ${key}] from\n${input[key]}\nto\n${value}`,
        );
    }

    //Store key value.
    input[key] = value;
}

/**
 * Loads all the source files and maps them to their entry points.
 * @param {string} baseInputPath
 * Glob path indicating all files we want for input.
 * @returns {Record<string, string>}
 * An object, mapping build entry points to their source files.
 *
 * For example, a file "src/SomeFolder/SomeModule.ts" will become
 * mapping:
 * "SomeFolder/SomeModule": "src/SomeFolder/SomeModule.ts"
 */
function loadInputs(baseInputPath) {
    //Create path to load all files.
    const globPath = path.join(baseInputPath, "/**/*.{ts,tsx,js,jsx}");

    //Load the desired list of files.
    const sourceFilePaths = globSync(globPath, {
        ignore: [
            //Exclude all test folders from the build.
            "**/__tests__/**",

            //Exclude definition files.
            "**/*.d.ts",
        ],
    });

    //Create the inputs object, mapping entry points to their source files.
    //For example,
    //```TypeScript
    //["src/SomeFile.ts"];
    //```
    //will become
    //```TypeScript
    //{
    //    "SomeFile": "src/SomeFile.ts"
    //}
    //```
    const inputs = {
        //Starts empty.
    };

    //Iterate source files, extracting their entry point and absolute path
    //and saving them to inputs.
    for (const sourceFilePath of sourceFilePaths) {
        //Convert the file path to a suitable entry name,
        //cutting off the base directory of "src" and the file extension.
        //For example,
        //"{projectPath}/src/folder/TestFile.js" becomes "folder/TestFile"
        const entryName = path.relative(
            baseInputPath,
            //Cut off the file extension.
            sourceFilePath.slice(
                0,
                sourceFilePath.length - path.extname(sourceFilePath).length,
            ),
        );

        //Since rollup.config.mjs is inside {project}/config/build,
        //and folder "src" is in {project}/src,
        //we need to modify path accordingly.
        let fromParentSourceFilePath = "../../" + sourceFilePath;

        //Convert any relative file paths to absolute paths.
        const filePath = fileURLToPath(
            new URL(fromParentSourceFilePath, import.meta.url),
        );

        //Save the new entry.
        setEntryValue(inputs, entryName, filePath);
    }

    return inputs;
}

/**
 *
 * @param {any[]} inputs
 * Array of input objects to be merged.
 * @returns
 * A combined input object.
 */
function mergeInputs(...inputs) {
    //Represents the combined inputs.
    //Initialize it to a copy of the first input.
    const mergedInputs = {
        ...inputs[0],
    };

    //Iterate the rest of the inputs and merge them in.
    for (let index = 1; index < inputs.length; ++index) {
        //Get next object to be merged.
        const nextInput = inputs[index];

        //Iterate this object.
        for (const [key, value] of Object.entries(nextInput)) {
            //If key already exists.
            if (mergedInputs[key]) {
                //Log that multiple have been detected.
                console.warn(
                    "Entries can only be mapped to 1 path.\n" +
                        "When there are more, it will use the most recent.\n" +
                        `Changing ${key}] from\n${mergedInputs[key]}\nto\n${value}`,
                );
            }

            //Store key value.
            mergedInputs[key] = value;
        }
    }

    return mergedInputs;
}

//Fetch inputs from source files.
const sourceInputs = loadInputs("src");

//Create configuration.
const rollupConfig = {
    //Mapping of inputs to source file paths.
    input: sourceInputs,
    output: [
        //CommonJS output.
        {
            dir: "dist",
            entryFileNames: "[name].cjs",
            format: "cjs",
            sourcemap: true,
        },
        //ES Module output.
        {
            dir: "dist",
            entryFileNames: "[name].mjs",
            format: "es",
            sourcemap: true,
        },
    ],
    plugins: modulePlugins,
};

//Provide the config object to importers of this file.
export default rollupConfig;
