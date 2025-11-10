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
 * Represents a 4 by 4 matrix for linear algebra calculations.
 */
export class Matrix4 {
    /**
     *
     * @returns
     * An identity matrix.
     */
    public static fromIdentity(): Matrix4 {
        //Backing array.
        const array: number[] = [
            1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ];

        return new Matrix4(array);
    }

    /**
     *
     * @param iterable
     * An iterable containing numbers to build a matrix from.
     * @throws {@link RangeError}
     * If iterable does not have at least 16 elements.
     * @returns
     * A matrix built from the numbers inside of iterable.
     */
    public static fromIterable(iterable: Iterable<number>): Matrix4 {
        //Create a new array as a copy of the iterable.
        const array = Array.from(iterable);

        //If array is too small to hold a 4x4 matrix.
        if (array.length < 4 * 4) {
            //Throw an error, telling user iterable has the wrong size.
            throw new RangeError(
                "Iterable does not have enough elements. " +
                    "Min is 16, got " +
                    array.length,
            );
        }

        return new Matrix4(array);
    }

    /**
     * Array backing the matrix.
     *
     * Array is stored in column major format.
     */
    private _array: number[];

    /**
     * @param array
     * The exact array that will back this matrix.
     */
    protected constructor(array: number[]) {
        //Save param.
        this._array = array;
    }

    /**
     *
     * @param x
     * X coordinate to get.
     * @param y
     * Y coordinate to get.
     * @returns
     * Value at the given x and y coordinate.
     */
    public get(x: number, y: number): number {
        return this._array[y * 4 + x];
    }

    /**
     *
     * @param x
     * X coordinate to set.
     * @param y
     * Y coordinate to set.
     * @param value
     * Value to save to the given x and y coordinate.
     */
    public set(x: number, y: number, value: number): void {
        this._array[y * 4 + x] = value;
    }

    /**
     * @returns
     * Number of columns in the matrix.
     */
    public get columns(): number {
        return 4;
    }

    /**
     * @returns
     * Number of rows in the matrix.
     */
    public get rows(): number {
        return 4;
    }
}
