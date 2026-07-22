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
 * Exports the ESLint configuration used for checking the project's source folder.
 * ESLint is a tool to find formatting problems in your code.
 */
import baseConfig from "./eslint.base.config.mjs"
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

/**
 * The configuration object this project is using for ESLint,
 * specifically in the {project}/src folder.
 * ESLint is used to check for bad coding practices.
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
    //Add the basic eslint config shared by everything in this project.
    ...baseConfig,
    //Ensures that all import paths are absolute as opposed to relative.
    {
        plugins: {
            //Pass the no relative imports plugin to ESLint.
            "no-relative-import-paths": noRelativeImportPaths
        },
        rules: {
            //Tell the plugin how to handle relative and absolute imports.
            "no-relative-import-paths/no-relative-import-paths": [
                "error",
                {
                    //Root folder of the source code.
                    //Is used to determine what source files are absolute relative to.
                    "rootDir": "src",
                    //What to put in front of all absolute imports.
                    "prefix": ""
                }
            ]
        }
    }
];

export default config;
