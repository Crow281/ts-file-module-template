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
 * Converts between different types of casing.
 */

/**
 * Converts camel case strings to snake case.
 *
 * Note that this does NOT change the character casing of the original string.
 * If you want lower snake casing, then call toLowerCase() on the result.
 * If you want upper snake casing, then call toUpperCase() on the result.
 * @param camelCase
 * Original camel case string.
 * @returns
 * String after converting it to snake case.
 */
export function camelCaseToSnakeCase(camelCase: string): string {
    //Split the individual words by the capital characters.
    const words: string[] = camelCase.split(/(?=[A-Z])/);

    //If split was succesful.
    if (words) {
        //Recombine the words with underscore between each of them.
        const snakeCase: string = words.join("_");

        return snakeCase;
    }

    //If there was nothing to split, just return the original word.
    return camelCase;
}
