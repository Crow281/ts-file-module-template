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
import { Application } from "form/Application";
import { ErrorObject, validateApplication } from "form/ValidateApplication";

//Test whether validation detects that this is not a circle at all.
test("test whether validateApplication detects that a json object is NOT a valid Application.", () => {
    //Create a json object to be tested.
    const jsonObject = {
        someWhere: "Here",
        value: 25,
    };

    //Validate the json object.
    const isValid: boolean = validateApplication(jsonObject);

    //Pass the result and correct answer to Jest.
    //We expect validation to fail.
    expect(isValid).toBeFalsy();
});

//Test whether validation detects that this is not a valid Application.
test("test whether validateApplication detects that an Application object has errors.", () => {
    //Create a circle with an invalid radius.
    const jsonObject = {
        firstName: "Sam",
        birthDate: "1801-11-13",
        duration: "P7D",
        specialNotes: "Just a regular trip.",
        invalidExtraData: false,
    };

    //Validate the object.
    validateApplication(jsonObject);

    //Get errors.
    //If there were no errors, this will be null.
    const errors: ErrorObject[] | null | undefined = validateApplication.errors;

    //Pass the result and correct answer to Jest.
    //We expect there to be errors.
    expect(errors).toBeTruthy();
});

//Test whether validation detects that this is not a valid circle.
test("test whether validateApplication detects that an Application object is valid.", () => {
    //Create a circle with an invalid radius.
    const jsonObject: Application = {
        firstName: "Peter",
        birthDate: "2001-11-13",
        duration: "P7D",
        specialNotes: "Just a regular trip.",
    };

    //Validate the object.
    const isValid: boolean = validateApplication(jsonObject);

    //Pass the result and correct answer to Jest.
    //We expect validation to succeed.
    expect(isValid).toBeTruthy();
});
