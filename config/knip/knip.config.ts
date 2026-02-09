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
 * Exports the project's knip configuration.
 * Knip is a tool used to check for anything not being used.
 */
import { KnipConfig } from "knip";

/**
 * The configuration object this project is using for knip.
 */
const config: KnipConfig = {
    //Array of glob patterns to find entry files.
    //Can prefix with "!" for negation (e.x. "!some/path/SomeFile.ts").
    entry: [
        //Give it the config directory, where all the project scripts are.
        "config/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
        //Give it the source directory, where all the project source files are.
        "src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
    ],

    //Array of glob patterns to find project files.
    //Can prefix with "!" for negation (e.x. "!some/path/SomeFile.ts").
    project: [],

    //Knip cannot detect all uses of dependencies,
    //such as dynamically imported ones.
    //Add any dependencies that are used,
    //but cannot be detected, to this array.
    //Make sure to leave a comment above them
    //to indicate where they are actually used.
    ignoreDependencies: [
        //Tells Babel how to reuse polyfills
        //instead of recreating them each file.
        "@babel/plugin-transform-runtime",

        //A preset for Babel that tells it how to transform code
        //for other environments
        "@babel/preset-env",

        //Tells Babel how to compile JSX.
        //Note that if your library doesn't use JSX or React,
        //then this dependency really is unused.
        //However, being a developer dependency, it won't do
        //any harm to the final compiled library.
        "@babel/preset-react",

        //Tells Babel how to convert TypeScript to JavaScript.
        "@babel/preset-typescript",

        //A plugin that allows Prettier to sort imports.
        //Is used by prettierrc.config.js
        "@trivago/prettier-plugin-sort-imports",

        //A tool used to test all versions of a dependency against Jest.
        //Is used by the {project}/config/TestAllVersions.ts script.
        "test-all-versions",

        //One of the plugins used by TypeDoc.
        //TypeDoc uses it to create external links to MDN types.
        "typedoc-plugin-mdn-links",
    ],

    //Knip cannot always figure out how some stuff is imported.
    //Add any imports that are used,
    //but cannot be detected as such by knip,
    //so that it will ignore them when creating the output.
    //
    //Make sure to leave a comment above them
    //to indicate where they are actually used
    //so that they can be removed from this list if
    //they are deprecated.
    ignoreUnresolved: [
        //Script file used by Jest to setup the tests.
        "./config/jest/scripts/GlobalSetup.ts",

        //Script file used by Jest to teardown the tests.
        "./config/jest/scripts/GlobalTeardown.ts",
    ],
};

//Provide the configuration object.
export default config;
