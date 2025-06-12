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
 *
 */
export class Vector4 {
    /**
     *
     * @returns
     * A new vector representing zero in all coordinates.
     */
    public static fromZero(): Vector4 {
        return new Vector4(0, 0, 0, 0);
    }

    /**
     * Array backing the vector. Initialize to zero.
     */
    private readonly _array: number[];

    /**
     * @param x
     * X coordinate to initialize with.
     * @param y
     * Y coordinate to initialize with.
     * @param z
     * Z coordinate to initialize with.
     * @param w
     * W coordinate to initialize with.
     */
    public constructor(x: number, y: number, z: number, w: number) {
        //Save values.
        this._array = [x, y, z, w];
    }

    /**
     *
     * @returns
     * A copy of the internal array backing this vector.
     */
    public toArray(): number[] {
        return [...this._array];
    }

    /**
     *
     * @param index
     * Index of the vector to get.
     * 0 for x, 1 for y, 2 for z, 3 for w.
     * @returns
     * Value at index.
     */
    public get(index: number): number {
        return this._array[index];
    }

    /**
     *
     * @param index
     * Index of the vector to change.
     * 0 for x, 1 for y, 2 for z, 3 for w.
     * @param value
     * New value of this coordinate.
     */
    public set(index: number, value: number): void {
        //Save new value.
        this._array[index] = value;
    }

    /**
     * @returns
     * X coordinate of this vector.
     */
    public get x(): number {
        return this._array[0];
    }

    /**
     * @param x
     * X coordinate of this vector.
     */
    public set x(x: number) {
        this._array[0] = x;
    }

    /**
     * @returns
     * Y coordinate of this vector.
     */
    public get y(): number {
        return this._array[1];
    }

    /**
     * @param y
     * Y coordinate of this vector.
     */
    public set y(y: number) {
        this._array[1] = y;
    }

    /**
     * @returns
     * Z coordinate of this vector.
     */
    public get z(): number {
        return this._array[2];
    }

    /**
     * @param z
     * Z coordinate of this vector.
     */
    public set z(z: number) {
        this._array[2] = z;
    }

    /**
     * @returns
     * W coordinate of this vector.
     */
    public get w(): number {
        return this._array[3];
    }

    /**
     * @param w
     * W coordinate of this vector.
     */
    public set w(w: number) {
        this._array[3] = w;
    }
}
