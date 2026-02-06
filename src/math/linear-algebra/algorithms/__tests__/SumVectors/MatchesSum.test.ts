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
import { expect, test } from "@jest/globals";
import { Vector4 } from "math/linear-algebra/Vector4";
import { sumVectors } from "math/linear-algebra/algorithms/SumVectors";

test("adds (0, 0, 0, 0) + (0, 23, 2, 3) + (28, 6, 32, 0) to equal (28, 29, 34, 3)", () => {
    //Vectors to sum up.
    const vectors: Vector4[] = [
        Vector4.fromZero(),
        new Vector4(0, 23, 2, 3),
        new Vector4(28, 6, 32, 0),
    ];

    //Vector representing the correct answer.
    const correctAnswer: number[] = [28, 29, 34, 3];

    //Sum the vectors.
    const summedVector: Vector4 = sumVectors(vectors);

    //Convert to an array so we can compare it.
    const summedVectorArray = summedVector.toArray();

    //Pass the result and correct answer to Jest.
    expect(summedVectorArray).toStrictEqual(correctAnswer);
});
