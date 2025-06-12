# folder-module-template

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

```typescript
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
            <a href="https://github.com/Crow281/ts-folder-module-template/tree/main/src/printing">
                "src/printing"
            </a>.
        </p>
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

You can access the github project [here](https://github.com/Crow281/ts-folder-module-template).

## Using This Template

You can read instructions to use this template for your very own NPM project
right
[here](https://github.com/Crow281/ts-folder-module-template/tree/main/doc/UserGuide.md).

## Documentation

The API documentation is available [here](https://crow281.github.io/ts-folder-module-template/doc/api/latest/).

## Structure

Whether due to curiosity, needing to fix a bug, or needing to modify it,
you can read the details behind how this template works over
[here](https://github.com/Crow281/ts-folder-module-template/tree/main/doc/Structure.md).

## Commands

### Lint

The following command allows you to use
[ESLint](https://www.npmjs.com/package/eslint)
to search your code for problems:
```console
npm run lint
```

### Format

The following command allows you to use
[Prettier](https://www.npmjs.com/package/prettier)
to format your code:
```console
npm run format
```

### Reset Exports

If for some reason you need to reset your package.json's exports field to its original state, you can use:
```console
npm run reset-exports
```

This will set package.json's exports field to exactly:
```TypeScript
    //...
    "exports": {
        "./package.json": "./package.json",
        "./*": {
            "types": "./dist/*.d.ts",
            "require": "./dist/*.cjs",
            "import": "./dist/*.mjs"
        }
    }
    //...
```

### Update Exports

Whenever you add new internal folders to
["{project}/src"](https://github.com/Crow281/ts-folder-module-template/tree/main/src),
you can use the following command to update your package.json's
exports field to block public import access to the resulting new modules:
```console
npm run update-exports
```

### Build

The following command allows you to build your project to
folder
"{project}/dist".
```console
npm run build
```

The command itself runs subcommands "clean", "build:js", and "build:types"
to handle deleting old files, building new modules, and building their
type definitions respectively as described below.

#### Build - Clean

If you just want to delete everything in the
"{project}/dist"
folder,

```console
npm run clean
```

#### Build - JS

If you just want to build the modules to the
"{project}/dist"
folder, use the following command:

```console
npm run build:js
```

#### Build - Types

If you just want to build the type definitions to the
"{project}/dist"
folder, use the following command:

```console
npm run build:types
```

### Test

The following command allows you to use
[Jest](https://www.npmjs.com/package/jest)
to run your test scripts:
```console
npm run test
```

### Document

The following command allows you to use
[TypeDoc](https://www.npmjs.com/package/typedoc)
to build documentation for
all your TypeScript files.
It outputs them to
"{project}/doc/api/latest".
If you are using a public git, you are advised to wait until
all changes are committed so that it can link the documentation to
your source files:
```console
npm run doc
```
