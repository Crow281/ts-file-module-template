# ts-file-module-template

## Introduction

This repository provides a template to simplify creating
new TypeScript NPM packages.

This template has the following properties:
<ul>
    <li>
        Source files are treated as modules.
        For example, if you have a class "SomeClass" in file
        "src/some-folder1/some-folder2/SomeClass.ts", then you can import it from
        the resulting NPM library via:
    </li>
</ul>

```TypeScript
import {
    SomeClass
} from "@my_scope/package_name/some-folder1/some-folder2/SomeClass";
```

<ul>
    <li>
        It builds using
        <a href="https://www.npmjs.com/package/rollup">Rollup</a>
        and
        <a href="https://www.npmjs.com/package/@babel/core">Babel</a>.
    </li>
    <li>
        <p>
            It supports importing
            <a href="https://en.wikipedia.org/wiki/JSON">JSON</a>,
            <a href="https://en.wikipedia.org/wiki/Comma-separated_values">CSV</a>,
            <a href="https://en.wikipedia.org/wiki/Tab-separated_values">TSV</a>,
            and
            <a href="https://www.npmjs.com/package/react">React JSX/TSX</a>
            files in addition to TypeScript and Javascript.
        </p>
        <p>
            Examples of how to import JSON and CSV are in folder
            <a href="https://github.com/Crow281/ts-file-module-template/tree/main/src/printing">
                "src/printing"
            </a>.
        </p>
    </li>
    <li>
        It uses
        <a href="https://www.npmjs.com/package/knip">
            knip
        </a>
        to help you find any problems with your project's dependencies.
    </li>
    <li>
        It supports pre-generating
        <a href="https://json-schema.org/">
            JSON Schema
        </a>
        validation code via
        <a href="https://www.npmjs.com/package/ajv">
            AJV
        </a>.
    </li>
    <li>
        It has a code generator script built over
        <a href="https://www.npmjs.com/package/json-schema-to-typescript">
            json-schema-to-typescript
        </a>,
        making it easy to create TypeScript interfaces
        based on your json schema and load JSON files into them.
    </li>
    <li>
        You can check for problems in your code via
        <a href="https://www.npmjs.com/package/eslint">ESLint</a>
    </li>
    <li>
        You can keep your code formatting consistent using
        <a href="https://www.npmjs.com/package/prettier">Prettier<a/>.
    </li>
    <li>
        You can debug via
        <a href="https://www.npmjs.com/package/jest">Jest</a>.
        Example test files are in "__tests__" folders under the src folder.
    </li>
    <li>
        You can generate documentation for your project via
        <a href="https://www.npmjs.com/package/typedoc">Typedoc</a>.
    </li>
</ul>

You can access the github project
[here](https://github.com/Crow281/ts-file-module-template).

## Using This Template

You can read instructions to use this template for your very own NPM project
right
[here](https://github.com/Crow281/ts-file-module-template/blob/main/doc/UserGuide.md).

## Documentation

The API documentation is available
[here](https://crow281.github.io/ts-file-module-template/doc/api/latest/).

## Structure

Whether due to curiosity, needing to fix a bug, or needing to modify it,
you can read the details behind how this template works over
[here](https://github.com/Crow281/ts-file-module-template/blob/main/doc/Structure.md).

## Scripts

A guide to all the NPM project scripts, such as test and build, is located
[here](https://github.com/Crow281/ts-file-module-template/blob/main/doc/Scripts.md).
