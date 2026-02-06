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
 * Represents an array with an arbitrary number of dimensions.
 * @type Type
 * Type stored to array.
 */
export interface ArrayN<Type> {
    /**
     *
     * @param position
     * Position we want to retrieve value from.
     *
     * If position array has fewer dimensions than this array,
     * they will be treated as 0.
     * @returns
     * Value at position.
     */
    getValue(position: number[]): Type;

    /**
     *
     * @param position
     * Position we want to store value to.
     *
     * If position array has fewer dimensions than this array,
     * they will be treated as 0.
     * @param value
     * Value we want to store at position.
     */
    setValue(position: number[], value: Type): void;

    /**
     *
     * @param dimension
     * Dimension we want to get the size of.
     * @returns
     * Size of this dimension.
     *
     * All unused dimensions will return 0.
     */
    getSize(dimension: number): number;

    /**
     * @returns
     * Number of dimensions this array is using.
     */
    get dimensions(): number;
}
