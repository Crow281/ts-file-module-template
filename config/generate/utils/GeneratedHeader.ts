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
 * Text added to all compatible generated files
 * so that they can be recognized.
 *
 *
 * The first couple lines, "eslint-disable" and
 * "@ts-nocheck", tell ESLint and the TypeScript
 * compiler not to run checks, like for unused variables.
 *
 * "@category Generated", marks this module as having
 * been dynamically generated.
 *
 * This overall comment block is used to identify
 * generated files during cleanup.
 */
export const GENERATED_HEADER = `/**
 * Some of the scripts creating generated scripts are
 * dependant on 3rd party libraries.
 *
 * This file was dynamically generated via script.
 * Generated files should NOT be edited by hand.
 * If you need to change something,
 * edit the script that created this file
 * or the file that it generated this script from.
 * A comment showing the path to said script should
 * be just below this one.
 * The generation scripts in general are located inside of
 * {project}/config/generate/*.
 *
 * Any UTF-8 file that contains this comment block,
 * character by character, will be considered a generated file.
 * Files with these exact comments will be deleted if you use:
 * npm run clean:generated
 */`;
