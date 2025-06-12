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
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import tseslint from "typescript-eslint";

export default [
    //Tell pluginReactConfig how to determine the react version.
    //In this case, it is being told to check for itself.
    {
        settings: {
            react: {
                version: "detect"
            }
        }
    },
    //Tell Lint we want access to browser globals.
    {
        languageOptions: {
            globals: globals.browser
        }
    },
    //Disable unused parameter checking.
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "args": "none"
                }
            ]
        }
    },
    //Setup javascript checking.
    pluginJs.configs.recommended,
    //Setup typescript checking.
    ...tseslint.configs.recommended,
    //Setup react checking.
    pluginReactConfig,
    //Disable anything prettier will handle.
    eslintConfigPrettier
];