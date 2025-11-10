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
 * Converts the given string to a multiline comment.
 * For example, "First Line\nSecond Line" becomes
 * ``ts
 * \/**
 *  * First Line
 *  * Second Line
 *  *\/
 * ``
 * @returns
 * The text as a comment.
 */
export function toCommentBlock(text: string): string {
    //Find the index of the first line in text.
    let newLineIndex: number = text.indexOf("\n");

    //If there are no newlines.
    if (newLineIndex < 0) {
        //Then return a multiline comment with only 1 line.
        return `/**
 * ${text}
 */`;
    }

    //Stores the built up comment.
    let comment: string = "/**\n";

    //Newline after the previous newline we found so that
    //we can extract the text between them.
    let nextNewLineIndex: number = text.indexOf("\n", newLineIndex + 1);

    //Keep iterating the new lines until we reach the last.
    while (nextNewLineIndex >= 0) {
        //Start index is the character after the previous newline.
        const startLineIndex: number = newLineIndex + 1;

        //Calculate the length of this line.
        const lineLength: number = nextNewLineIndex - startLineIndex;

        //If this line is empty.
        if (lineLength <= 0) {
            //Append a single star to the comment.
            comment += ` *\n`;

            //If line is not empty.
        } else {
            //Get the text between the newlines.
            const line: string = text.substring(
                startLineIndex,

                //Ending index is the character before the next newline.
                nextNewLineIndex,
            );

            //Append the line to the comment.
            comment += ` * ${line}\n`;
        }

        //Iterate to the next line.
        newLineIndex = nextNewLineIndex;
        nextNewLineIndex = text.indexOf("\n", nextNewLineIndex + 1);
    }

    //We have reached the last line.
    //Get the last line of text.
    const lastLine: string = text.substring(newLineIndex);

    //Append the last line of text.
    if (lastLine === "\n") {
        comment += ` *
 */`;
    } else {
        comment += ` * ${lastLine}
 */`;
    }

    return comment;
}
