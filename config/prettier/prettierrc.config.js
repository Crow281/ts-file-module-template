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
 * Exports the project's prettier configuration.
 * Prettier is a tool to fix the formatting throughout your project.
 */

/**
 * The configuration object this project is using for depcheck.
 * @type {Partial<import("prettier").Config>}
 */
const config = {
    plugins: [
        //Add plugin to give imports consistent ordering.
        "@trivago/prettier-plugin-sort-imports",
    ],

    //Adds line breaks between different groups of imports,
    //as specified by the string patterns inside of
    //config property importOrder
    importOrderSeparation: true,

    //Orders the imported types from a given module.
    //For example,
    //import { B, A } from "SomeModule" will become
    //import { A, B } from "SomeModule"
    importOrderSortSpecifiers: true,

    //Try to keep lines no bigger than 80 characters.
    printWidth: 80,

    //Make each indent 4 spaces.
    tabWidth: 4,
};

//Provide the configuration object.
export default config;
