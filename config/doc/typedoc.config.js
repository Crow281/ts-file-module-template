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
 * Configuration object.
 * @type {Partial<import("typedoc").TypeDocOptions>}
 */
const config = {
    //How much we want typedoc to print to console. Defaults to "Info".
    logLevel: "Verbose",
    //List of plugins we are adding to typedoc.
    plugin: [
        //This plugin enables typedoc to understand
        //some of the global object types (like Math) and link them.
        "typedoc-plugin-mdn-links",
        //This custom plugin marks all modules under
        //an "internal" folder with the @internal tag.
        "./plugin/TagInternal.js",
        //This custom plugin will move all the modules to under a root folder.
        "./plugin/RootModule.js",
    ],
    //Tells TypeDoc how to handle 3rd party library types.
    externalSymbolLinkMappings: {},
    //Specify where to find the typescript configuration for this project.
    tsconfig: "../../tsconfig.json",
    //Search all of the folders in entry points.
    entryPointStrategy: "Expand",
    //List of locations to search for files to document.
    entryPoints: ["../../src/"],
    //What scripts shouldn't be documented.
    exclude: [
        //Do not include test scripts in the build.
        "**/__tests__/**",
    ],
    //Location of the project readme file.
    readme: "../../README.md",
    //Additional documents to package into the TypeDoc.
    projectDocuments: ["../../CHANGELOG.md"],
    //Where to write the documentation to.
    out: "../../doc/api/latest",
};

//Provide configuration object to typedoc.
export default config;
