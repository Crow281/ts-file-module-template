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
 * Tests all versions of the project's peer dependencies.
 *
 * TODO: Not yet tested.
 */
import Package from "../package.json";
import { spawn } from "node:child_process";

/**
 * Async wrapper for exec.
 * @param command
 * The command to be executed.
 * @returns
 * A promise that will execute the command and resolve upon completion
 * or reject on failure.
 */
function execAsync(
    command: string,
    commandArguments: readonly string[],
): Promise<void> {
    //Create the executor that will wrap the process.
    const executor = (
        resolve: (value: void | PromiseLike<void>) => void,
        reject: (reason?: unknown) => void,
    ): void => {
        //Keep the command safe.
        try {
            //Run the command.
            const childProcess = spawn(
                //Command to be executed.
                command,
                //Arguments passed to process.
                commandArguments,
                {},
            );

            //Bind output.
            childProcess.stdout.on("data", (data: unknown) => {
                console.log(data);
            });

            //Bind errors.
            childProcess.stderr.on("data", (data: unknown) => {
                console.error(data);
            });

            //Bind close event so that we know when it terminates.
            //NOTES: For whatever reason, the type definition file for child_process
            //mentions the existence of this function, yet my editor
            //cannot detect its existence.
            childProcess.on("close", (code: unknown) => {
                //If the process terminated normally.
                if (code === 0) {
                    resolve();

                    //If something went wrong.
                } else {
                    //Trigger error code.
                    reject(code);
                }
            });

            //If anything goes wrong.
        } catch (error) {
            //Cause promise to fail.
            reject(error);
        }
    };

    return new Promise(executor);
}

/**
 * Runs the unit tests with the given versions of the given package.
 * @param {string} packageName
 * Name of the package to be tested.
 * @param {string} versionRange
 * Version range to be tested.
 */
function testVersion(packageName: string, versionRange: string): Promise<void> {
    //Tell user which package we are about to test.
    console.log(`Testing ${packageName} versions ${versionRange}`);

    //Run the command.
    return execAsync("tav", [packageName, versionRange]);
}

/**
 * Tests the desired set of dependencies.
 * @param dependencyType
 * The type of dependency to be tested.
 * @returns
 * A promise tracking the results.
 */
async function testDependencies(
    npmPackage: Record<string, unknown>,
    dependencyType: "peerDependencies" | "dependencies",
): Promise<void> {
    //Fetch the desired dependencies.
    const dependencies = npmPackage[dependencyType];

    //If dependencies is not an object, nothing to test.
    if (typeof dependencies !== "object") {
        return;
    }

    //If dependencies is null or undefined, nothing to test.
    if (!dependencies) {
        return;
    }

    //If dependencies is an array, nothing to test.
    if (Array.isArray(dependencies)) {
        return;
    }

    //Fetch the array of dependencies.
    const dependencyEntries: [string, unknown][] = Object.entries(dependencies);

    //Iterate the dependencies.
    for (const [packageName, versionRange] of dependencyEntries) {
        //If versionRange is anything other than a string, skip it.
        if (typeof versionRange !== "string") {
            continue;
        }

        //Run tests on this package.
        await testVersion(packageName, versionRange);
    }
}

/**
 * Contains the overall logic of this script.
 * @returns
 * A promise running the script.
 */
async function run(): Promise<void> {
    //Test the dependencies first.
    await testDependencies(Package as Record<string, unknown>, "dependencies");

    //Then test the peer dependencies.
    await testDependencies(
        Package as Record<string, unknown>,
        "peerDependencies",
    );
}

//Catch anything that goes wrong.
try {
    //Run the script.
    await run();

    //If anything goes wrong, print it.
} catch (error) {
    console.error(error);
}
