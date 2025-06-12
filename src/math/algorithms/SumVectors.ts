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
import { Vector4 } from "math/Vector4";

/**
 *
 * @param vectors
 * An iterable containing some numbers we want to add up.
 * @returns
 * The sum of all numbers inside of iterable.
 */
export function sumVectors(vectors: Iterable<Vector4>): Vector4 {
    //Used to record sum while calculating it.
    let x: number = 0;
    let y: number = 0;
    let z: number = 0;
    let w: number = 0;

    //Iterate all the vectors.
    for (const value of vectors) {
        //Sum up their values.
        x += value.x;
        y += value.y;
        z += value.z;
        w += value.w;
    }

    return new Vector4(x, y, z, w);
}
