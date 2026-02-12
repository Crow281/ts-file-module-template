/*
 * The MIT License
 *
 * Copyright 2026 Crow281.
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
//NPM Package for the Babel Runtime being used.
import runtimePackage from "@babel/runtime/package.json" with { type: "json" };

/**
 * The configuration object this project is using for Babel.
 * Babel is a transpiler used to increase compatibility.
 * @type {import("@babel/core").TransformOptions}
 */
const config = {
    presets: [
        //Make Babel support most environments.
        //It can leave out stuff that's dead.
        [
            "@babel/preset-env",
            {
                targets: ">0.2%, not dead, not op_mini all",
            },
        ],

        //Make Babel support React.
        "@babel/preset-react",

        //Make Babel support TypeScript.
        "@babel/preset-typescript",
    ],
    plugins: [
        //Make Babel import the polyfills from its runtime.
        [
            "@babel/plugin-transform-runtime",
            {
                //Tell Babel transform plugin which version of the runtime
                //it is using so it knows what polyfills are available.
                version: runtimePackage.version,
            },
        ],
    ],
};

//Provide the configuration object.
export default config;
