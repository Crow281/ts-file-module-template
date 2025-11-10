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
import path from "node:path";

/**
 * Represents an imported object.
 */
export interface Import {
    /**
     * Path used to import the module.
     */
    modulePath: string;

    /**
     * Declaration from the module being imported.
     */
    declarationName: string;

    /**
     * The alias chosen for this import.
     */
    aliasName: string;
}

/**
 * Used to create aliases for imports.
 */
export class AliasNameFactory {
    /**
     * Maps aliases to the import they represent.
     */
    private _aliasNameToImport: Map<string, Import> = new Map();

    /**
     *
     */
    constructor() {
        //
    }

    /**
     *
     * @param declarationName
     * Original type we want an alias for.
     * @returns
     * An as of yet unchosen alias for the given type name.
     * If typeName itself hasn't been used yet, it will just return that.
     */
    private pickAlias(declarationName: string): string {
        //Fetch alias map so that we can check what has already been used.
        const aliasNameToImport = this._aliasNameToImport;

        //Alias that will be used for interface in code.
        let aliasName: string;

        //The next alias number we will try.
        //For example, if "TypeName1" is taken, we can try "TypeName2" next.
        let nextAliasNumber: number = 1;

        //Keep checking possible aliases until we find an unused one.
        for (
            //Use the original typeName if possible.
            //We will need to use an alias if not.
            aliasName = declarationName;
            //Keep iterating until we find an alias that isn't being used.
            aliasNameToImport.has(aliasName);
            //Update the alias we are trying.
            aliasName = declarationName + nextAliasNumber
        ) {
            //If we reached this point, the previous aliasName didn't work,
            //so update the next alias number to try.
            nextAliasNumber += 1;
        }

        return aliasName;
    }

    /**
     *
     * @returns
     * An arbitrary alias that doesn't represent any particular type.
     */
    public createAnonymousAlias(): string {
        //Generate an alias name.
        const aliasName: string = this.pickAlias("Unnamed");

        //Fetch alias map so that we can store to it.
        const aliasNameToImport = this._aliasNameToImport;

        //Store this alias and map it to what it is importing.
        aliasNameToImport.set(aliasName, {
            modulePath: "",
            declarationName: "",
            aliasName: aliasName,
        });

        return aliasName;
    }

    /**
     *
     * @param declarationName
     * @param modulePath
     * @returns
     * An as yet unchosen alias that can represent typeName.
     */
    public createAlias(
        declarationName: string | null | undefined,
        modulePath: string,
    ): string {
        //If no typeName was given.
        if (!declarationName || declarationName.length <= 0) {
            return this.createAnonymousAlias();
        }

        //Generate an alias name.
        const aliasName: string = this.pickAlias(declarationName);

        //Fetch alias map so that we can store to it.
        const aliasNameToImport = this._aliasNameToImport;

        //Store this alias and map it to what it is importing.
        aliasNameToImport.set(aliasName, {
            modulePath: modulePath,
            declarationName: declarationName,
            aliasName: aliasName,
        });

        return aliasName;
    }

    /**
     * @param mainModulePath
     * Module path the imports are being created for.
     *
     * This import will not be added to the list of imports.
     * You can use this to ensure the file you are building imports
     * for does not import itself.
     *
     * It will also make the other imports relative to it.
     * @returns
     * Import code for everything stored to this factory.
     *
     * Anonymous imports are ignored, as is whatever is
     * passed to parameter ignoredAliasName.
     */
    public createImports(mainModulePath?: string): string {
        //Create list of imports.
        let importCode: string = "";

        //Get mapping of all aliases and imports.
        const aliasNameToImport = this._aliasNameToImport;

        //Iterate mapping of interface name to schema.
        for (const [aliasName, aliasImport] of aliasNameToImport) {
            //Skip any anonymous imports.
            if (aliasImport.declarationName.length <= 0) {
                continue;
            }

            //Fetch typeName and import.
            const typeName = aliasImport.declarationName;
            const modulePath = aliasImport.modulePath;

            //Skip the module we want to ignore (if any).
            if (modulePath === mainModulePath) {
                continue;
            }

            //Stores the relative position of the given modulePath
            //compared to mainModulePath.
            let relativeModulePath;

            //If we were given a mainModulePath.
            if (mainModulePath) {
                //Fetch folder the main module is in.
                const mainModuleDir: string = path.dirname(mainModulePath);

                //Fetch folder the current module is in.
                const moduleDir: string = path.dirname(modulePath);

                //Calculate the relative module path.
                relativeModulePath = path.relative(mainModuleDir, modulePath);

                //If the two items are in the same dir.
                if (mainModuleDir === moduleDir) {
                    //Append "./" to indicate that it is in the same folder.
                    relativeModulePath = "./" + relativeModulePath;
                }

                //If there is no mainModulePath.
            } else {
                //Then just use the absolute path.
                relativeModulePath = mainModulePath;
            }

            //If we didn't need an alias for this import.
            if (aliasName === typeName) {
                //Then we can just import directly.
                importCode += `import { type ${aliasName} } from "${relativeModulePath}";\n`;

                //If we ended up needing an alias because
                //there were multiple types with the same name.
            } else {
                //Convert it to its alias.
                importCode += `import { type ${typeName} as ${aliasName} } from "${relativeModulePath}";`;
            }
        }

        return importCode;
    }

    /**
     * @returns
     * Mapping of all aliases to the import they represent.
     */
    public get aliasNameToImport(): Map<string, Import> {
        return this._aliasNameToImport;
    }
}
