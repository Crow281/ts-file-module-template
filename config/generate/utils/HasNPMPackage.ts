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
 * Contains functions for checking if given
 * NPM packages exist.
 */
import { readJSONFile } from "./json/ReadJSONFile";

/**
 * @returns
 * NPM package.json file as a JSON object.
 */
function loadProjectPackage(): Promise<object> {
    //Read JSON file at package.json.
    return readJSONFile("./package.json");
}

/**
 *
 * @param jsonObject
 * Object we want to check for the dependency.
 * @param dependencyType
 * Dependency type we want to check.
 * @param packageName
 * Package we want to check for.
 * @returns
 * true if package exists as dependencyType.
 */
export function objectHasNPMPackage(
    jsonObject: object,
    dependencyType: "devDependencies" | "peerDependencies" | "dependencies",
    packageName: string,
): boolean {
    //Fetch object containing desired dependencies.
    const dependencies = jsonObject[dependencyType];

    //If we do not have the given dependency type in the first place, fail.
    if (typeof dependencies !== "object") {
        return false;
    }

    //Fetch dependency.
    const dependency = dependencies[packageName];

    //Return true if dependency exists.
    if (dependency) {
        return true;
    }

    return false;
}

/**
 *
 * @param dependencyType
 * Dependency we want to check for.
 * @param package
 * Package we are checking for.
 * @returns
 * true if NPM package has the given package as the given dependency.
 */
export async function hasNPMPackage(
    dependencyType: "devDependencies" | "peerDependencies" | "dependencies",
    packageName: string,
): Promise<boolean> {
    //Fetch project package.
    const projectPackage: object = await loadProjectPackage();

    return objectHasNPMPackage(projectPackage, dependencyType, packageName);
}

/**
 *
 * @param packageName
 * Package we are checking for.
 * @returns
 * Which type of dependency this packageName is,
 * "none" if it doesn't exist.
 */
export async function getNPMPackageDependencyType(
    packageName: string,
): Promise<"devDependencies" | "peerDependencies" | "dependencies" | "none"> {
    //Fetch project package.
    const projectPackage: object = await loadProjectPackage();

    //Check each dependency type.
    //Return said dependency type if it matches.
    if (objectHasNPMPackage(projectPackage, "devDependencies", packageName)) {
        return "devDependencies";
    }
    if (objectHasNPMPackage(projectPackage, "peerDependencies", packageName)) {
        return "peerDependencies";
    }
    if (objectHasNPMPackage(projectPackage, "dependencies", packageName)) {
        return "dependencies";
    }

    //If none of them matched, return none.
    return "none";
}
