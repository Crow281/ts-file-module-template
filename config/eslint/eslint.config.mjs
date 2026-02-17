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
 * Exports the project's ESLint configuration.
 * ESLint is a tool to find formatting problems in your code.
 */
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * The configuration object this project is using for ESLint.
 * ESLint is used to check for bad coding practices.
 * @type {import("eslint").Linter.Config[]}
 */
const config = [
    //Tell Lint we want access to browser globals.
    {
        languageOptions: {
            globals: globals.browser,
        },
    },
    //Add any custom rules we want to ESLint.
    {
        rules: {
            //Disable unused parameter checking.
            //It is common for interfaces or callbacks
            //to define parameters you might not plan on using.
            //I figure that for documentation purposes
            //and potential future modifications,
            //it's better to leave them in even if not used.
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "none",
                },
            ],
        },
    },
    //Setup javascript checking.
    pluginJs.configs.recommended,
    //Setup typescript checking.
    ...tseslint.configs.recommended,
    //Disable anything prettier will handle.
    eslintConfigPrettier,
];

//This try catch block is to make ESLint React support optional.
//Check and see if ESLint React support is installed.
try {
    //Try to import eslint's react support.
    const eslintPluginReactModule = await import("eslint-plugin-react/configs/recommended.js");

    //If we reached this point without error, ESLint react support is installed.
    //Add ESLint React plugin.
    config.push(eslintPluginReactModule.default);

    //Tell pluginReactConfig to check the React version for itself.
    //Note that if React isn't installed, this will result in a warning.
    config.push(
        {
            settings: {
                react: {
                    version: "detect",
                },
            },
        }
    );

    //If we fail to import ESLint React support.
} catch {
    //Tell user we are skipping react.
    console.log("Package \"eslint-plugin-react\" is not installed, skipping React support.");
}

export default config;
