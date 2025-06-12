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
 * Configuration file for Rollup,
 * telling it how to build the project.
 * 
 * This will load a list of all typescript and javascript file,
 * as well as any json and css files they import,
 * from folder "{project}/src", and build them to folder "{project}/dist".
 */
import { globSync } from "glob";
import * as path  from "node:path";

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import dsv from "@rollup/plugin-dsv";
import includePaths from "rollup-plugin-includepaths";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import { fileURLToPath } from 'node:url';

//Since rollup.config.mjs is inside {project}/config,
//and src is in {project}/src, sometimes
//src needs to be relative to the config file's location,
//and other times it needs to be relative to {project}'s location

//List of plugins all modules use that don't need custom configuration.
const modulePlugins = [
    //Makes it possible to import modules using src as the base path.
    includePaths({
        paths: [
            "src"
        ],
        extensions: [
            ".json",
            ".csv",
            ".tsx",
            ".js",
            ".jsx",
            ".ts",
            ".tsv"
        ]
    }),
    //Allows searching 3rd party modules.
    nodeResolve({
        extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx"
        ]
    }),
    //Makes it possible to convert CSV and TSV files into Javascript objects
    //and import them.
    dsv(),
    //Converts json files to ES6 modules.
    json({
        preferConst: true,
        compact: true,
        namedExports: false
    }),
    //Converts CommonJS modules into ES modules.
    commonjs(),
    //Ensures backwards compatibility
    babel({
        //Tell babel where to find the config file.
        configFile: "./config/babel.config.json",
        //Import babel by bundling it directly into the build.
        babelHelpers: "bundled",
        //Don't need to embed anything inside of node_modules.
        exclude: [
            "**/node_modules/**",
            "**/__tests__/**"
        ],
        //Types of files to transpile.
        extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx"
        ]
    })
];

//Get list of all source file paths.
const sourceFilePaths = globSync(
    "./src/**/*.{ts,tsx,js,jsx}",
    {
        ignore: [
            //Exclude all test folders from the build.
            "**/__tests__/**"
        ]
    }
);


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
const inputs = Object.fromEntries(
    sourceFilePaths.map(
        (file) => {
            //Convert the file path to a suitable entry name,
            //cutting off the base directory of "src" and the file extension.
            //For example,
            //"{projectPath}/src/folder/TestFile.js" becomes "folder/TestFile"
            const entryName = path.relative(
                "src",
                //Cut off the file extension.
                file.slice(0, file.length - path.extname(file).length)
            );

            //Since rollup.config.mjs is inside {project}/config,
            //and folder "src" is in {project}/src,
            //we need to modify path accordingly.
            file = "../" + file;

            //Convert any relative file paths to absolute paths.
            const filePath = fileURLToPath(new URL(file, import.meta.url));

            //Return the entry name/file path pairing.
            return [
                entryName,
                filePath
            ];
        }
    )
);

//Create configuration.
const rollupConfig = {
    //Mapping of inputs to source file paths.
    input: inputs,
    output: [
        //CommonJS output.
        {
            dir: "dist",
            entryFileNames: "[name].cjs",
            format: "cjs",
            sourcemap: true
        },
        //ES Module output.
        {
            dir: "dist",
            entryFileNames: "[name].mjs",
            format: "es",
            sourcemap: true
        }
    ],
    plugins: modulePlugins
}

//Provide the config object to importers of this file.
export default rollupConfig;
