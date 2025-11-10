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
 * Represents an array of records from a Separated Value document,
 * like CSV or TSV.
 *
 * This is an array holding a list of objects, mapping properties to strings.
 * @type Columns
 * Defines the keys of each element in the array.
 * Defaults to just letting user pick a string.
 */
declare type TSV<Columns extends string = string> = Array<
    Record<Columns, string>
>;

/**
 * Defines how to import TSV files
 * to TypeScript.
 *
 * This describes the contents of any imported module that ends with ".tsv".
 */
declare module "*.tsv" {
    /**
     * Represents the data of the imported file.
     *
     * Rollup uses the d3-dsv library to parse CSV/TSV files.
     * DSVRowArray is the type returned by it.
     * Rollup simplifies the resulting DSVRowArray a bit further.
     * The above type, TSV, is our approximation of what
     * Rollup turns it into.
     *
     * Unless project owner overrides the dsv plugin's
     * processRow config option
     * inside of "{project}/config/rollup.config.mjs",
     * it is expected to contain string values.
     */
    const content: TSV;

    /**
     * Make it so that default export is defined by
     * variable content.
     */
    export default content;
}
