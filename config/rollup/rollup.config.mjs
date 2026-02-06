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
import { nodeExternals } from "rollup-plugin-node-externals";

//Since rollup.config.mjs is inside {project}/config/build,
//src is in {project}/src, and the script is called from {project}.
//Since the script is called from {project},
//that is what the files need to be relative to.

//List of all script file extensions we are compiling.
const supportedScriptFileExtensions = [
    //CommonJS Module
    ".cjs",
    //Common TypeScript,
    //specifies a TypeScript file to be compiled to a CommonJS Module.
    ".cts",
    //JavaScript
    ".js",
    //JavaScript XML
    ".jsx",
    //ES Module
    ".mjs",
    //ES TypeScript,
    //specifies a TypeScript file to be compiled to an ES Module.
    ".mts",
    //TypeScript
    ".ts",
    //TypeScript XML
    ".tsx",
];

//List of all script file extensions we are compiling in the form of a glob.
const supportedScriptFileExtensionsGlob = ".{cjs,cts,js,jsx,mjs,mts,ts,tsx}";

//List of all file extensions expected to be imported.
const importedFileExtensions = [
    ...supportedScriptFileExtensions,
    //JavaScript Object Notation
    ".json",
    //Comma Separated Values
    ".csv",
    //Tab Separated Values
    ".tsv",
];

//List of plugins all modules use that don't need custom configuration.
const modulePlugins = [
    //This plugin tells Rollup what imports refer to code outside the project code.
    nodeExternals({
        //Ensure imports of dependencies are marked as external.
        deps: true
    }),
    //Makes it possible to import files using src as the base path.
    includePaths({
        paths: ["src"],
        extensions: importedFileExtensions,
    }),
    //Allows searching 3rd party modules.
    nodeResolve({
        extensions: supportedScriptFileExtensions,
    }),
    //Makes it possible to convert CSV and TSV files into Javascript objects
    //and import them.
    dsv(),
    //Converts JSON and JSON5 files into importable variables.
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
        configFile: "./config/babel/babel.config.js",
        //Babel defines several helpers to increase compatibility across platforms.
        //"bundled" makes it define the helpers directly in the library,
        //"runtime" makes it import from babel and requires you to add babel as a dependency.
        //Import babel helpers from the runtime,
        //potentially allowing multiple libraries across a given project
        //to share the same code.
        babelHelpers: "runtime",
        //globs for files babel should ignore.
        exclude: [
            //Don't need to embed anything inside of node_modules.
            "**/node_modules/**",

            //Don't need to include the test scripts.
            "**/__tests__/**",
        ],
        //Types of files to transpile.
        extensions: supportedScriptFileExtensions,
    }),
];

/**
 * Stores a new key value pair to input.
 * Triggers a warning if the key already exists.
 * @param {Record<string, string>} input
 * input object mapping entry points to source paths.
 * @param {string} key
 * Entry point with value we are setting.
 * @param {string} value
 * New value of the entry point.
 */
function setEntryValue(input, key, value) {
    //If key already exists.
    if (input[key]) {
        //Log that multiple instances of key have been detected.
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
    const globPath = path.join(
        baseInputPath,
        "/**/*" + supportedScriptFileExtensionsGlob,
    );

    //Load the desired list of files.
    const sourceFilePaths = globSync(globPath, {
        ignore: [
            //Internal scripts should not be made available to the end user,
            //so do not include them in the inputs.
            //Let Rollup itself find and build them when inputs import them.
            "**/internal/**",

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

//Fetch inputs from source files.
const sourceInputs = loadInputs("src");

//Create configuration.
/**
 * Rollup configuration.
 * @type {import("rollup").InputOptions}
 */
const rollupConfig = {
    //Mapping of inputs to source file paths.
    input: sourceInputs,

    //Controls where and how to output compiled modules.
    output: [
        //CommonJS Module output.
        {
            //Put CommonJS modules within a common distribution folder.
            dir: "dist/cjs",

            //Naming convention for CJS files.
            entryFileNames: "[name].cjs",

            //CommonJS Module file format.
            format: "cjs",

            //Make sure end user can easily lookup
            //the source for compiled files.
            sourcemap: true,
        },
        //ES Module output.
        {
            //Put ES modules within a common distribution folder.
            dir: "dist/esm",

            //Naming convention for CJS files.
            entryFileNames: "[name].mjs",

            //ES Module file format.
            format: "es",

            //Make sure end user can easily lookup
            //the source for compiled files.
            sourcemap: true,
        },
    ],

    //List of plugins to process modules.
    plugins: modulePlugins,

    //When the Rollup compiler triggers a warning.
    onwarn: (warning, defaultHandler) => {
        //If this is just warning about empty bundles.
        if (warning.code === "EMPTY_BUNDLE") {
            //Empty bundles are the result of compiling a script file that
            //produces no runtime code.
            //This is most commonly a side effect of compiling TypeScript interfaces.
            //TypeScript interfaces simply define what certain objects should look like.
            //Since JavaScript doesn't check for interface type safety at
            //runtime or have any other runtime use for them,
            //this results in no runtime code.
            //Just ignore it.
            return;
        }

        //Otherwise, handle the warning like normal.
        defaultHandler(warning);
    },
};

//Provide the config object to importers of this file.
export default rollupConfig;
