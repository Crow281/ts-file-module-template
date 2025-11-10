# Structure

This document explains how the template is setup and the rationale behind it.

Project
[NPM Dependencies](https://github.com/Crow281/ts-file-module-template/tree/main/doc/Dependencies.md)
are on their own page.

## Rollup

This template uses Rollup as the overall bundler.

The Rollup config file is located at
["{project}/config/build/rollup.config.mjs"](https://github.com/Crow281/ts-file-module-template/blob/main/config/build/rollup.config.mjs).

The config file will get a list of every source file under
["{project}/src"](https://github.com/Crow281/ts-file-module-template/tree/main/src/)
and convert it into an object mapping entry points to their sources:
```TypeScript
const inputs = {
    "SomeClass1": "../src/SomeClass.ts",
    "some-module/SomeClass2": "../src/some-module/SomeClass2.ts"
    //...
}
```

Using Babel, it will build them into CommonJS and ES modules.

These modules will be written to the
"{project}/dist"
folder, using the same subfolders as their sources.
For example, the builds for all scripts under folder "src/some-module"
will be placed in "dist/some-module".

## Babel

This template hooks Rollup to Babel to handle the actual compiling,
converting TypeScript source files into JavaScript module files and
helping to ensure backwards compatibility.

The Babel config file is located at
["{project}/config/build/babel.config.json"](https://github.com/Crow281/ts-file-module-template/blob/main/config/build/babel.config.json).

It includes presets to let it handle React and TypeScript.

## TypeScript

While Babel is used to handle the actual task of transpiling TypeScript
code to JavaScript, the original TypeScript compiler is still used to
create the definition files.

### Config

One TypeScript configuration file, intended for your editor's use, is in
["{project}/tsconfig.json"](https://github.com/Crow281/ts-file-module-template/blob/main/tsconfig.json).

A second TypeScript configuration file, intended for the actual build, is in
["{project}/tsconfig.production.json"](https://github.com/Crow281/ts-file-module-template/blob/main/tsconfig.production.json).

The only difference between the two is that "tsconfig.production.json"
excludes all "__test__" folders.
The reason this is necessary is so
that your editor will recognize the __test__ scripts as TypeScript
files while excluding them from the actual build.

### Custom File Extensions

In the event that you need to support importing custom file extensions,
you can leave the type definition files for them inside of the
["{project}/config/build/types"](https://github.com/Crow281/ts-file-module-template/tree/main/config/build/types/)
folder.

This folder already has definition files for
[CSV](https://en.wikipedia.org/wiki/Comma-separated_values)
and
[TSV](https://en.wikipedia.org/wiki/Tab-separated_values)
files. The definition files describe any module ending in ".csv" or ".tsv"
as the arrays that the
[Rollup "dsv" plugin](https://www.npmjs.com/package/@rollup/plugin-dsv)
converts them into via the library,
["d3-dsv"](https://www.npmjs.com/package/d3-dsv).

## Generated

This template has several scripts that can dynamically generate code
to work with any JSON Schema files you have in the project.

These scripts are located inside of
["{project}/config/generate"](https://github.com/Crow281/ts-file-module-template/tree/main/config/generate/).

### Clean

All generated scripts start with a specific comment located inside of
["{project}/config/generate/utils/GeneratedHeader.ts"](https://github.com/Crow281/ts-file-module-template/blob/main/config/generate/utils/GeneratedHeader.ts),
used to identify them. The
["{project}/config/generate/CleanGeneratedScripts.ts"](https://github.com/Crow281/ts-file-module-template/blob/main/config/generate/CleanGeneratedScripts.ts)
scans for all files under {project}/src starting with that comment
and delete them when you want to clean all the old generated scripts.

I originally attempted to place the generated scripts into their own
source folder, but that messed up their relationship compared to the
rest of the library as there is no easy way to make TypeScript and
its related tools to treat two separate source folders as the same.

## ESLint

This template uses ESLint to check for any coding problems.

The ESLint config file is located in
["{project}/config/lint/eslint.config.mjs"](https://github.com/Crow281/ts-file-module-template/blob/main/config/lint/eslint.config.mjs).

It is setup to handle JavaScript, TypeScript, React, and browser globals.

The "@typescript-eslint/no-unused-vars" rule was added
to disable warnings for unused parameters, since it is common
for stuff like callbacks or TypeScript interfaces to define parameters
you are not necessarily using right now.

This template is using the following list of ESLint plugins:

<table>
    <tr>
        <th>
            Plugin
        </th>
        <th>
            Description
        </th>
    </tr>
    <tr>
        <td>
            "@eslint/js"
        </td>
        <td>
            Allows ESLint to be able to handle JavaScript.
        </td>
    </tr>
    <tr>
        <td>
            "typescript-eslint"
        </td>
        <td>
            Allows ESLint to be able to handle TypeScript.
        </td>
    </tr>
    <tr>
        <td>
            "eslint-plugin-react"
        </td>
        <td>
            Allows ESLint to be able to handle React.
        </td>
    </tr>
    <tr>
        <td>
            "eslint-config-prettier"
        </td>
        <td>
            Any rules of ESLint that would conflict with Prettier are disabled.
        </td>
    </tr>
</table>

## Prettier

This template uses
[Prettier](https://www.npmjs.com/package/prettier)
to keep the formatting consistent.

The Prettier config file is located in
["{project}/config/format/.prettierrc.json"](https://github.com/Crow281/ts-file-module-template/tree/main/config/format/.prettierrc.json).

This template is using the following list of Prettier plugins:

<table>
    <tr>
        <th>
            Plugin
        </th>
        <th>
            Description
        </th>
    </tr>
    <tr>
        <td>
            "@trivago/prettier-plugin-sort-imports"
        </td>
        <td>
            Orders the imports.
        </td>
    </tr>
</table>

## Typedoc

This template uses
[TypeDoc](https://www.npmjs.com/package/typedoc)
to generate documentation for the source files.

### config/doc/plugin/TagInternal.js

This is one of the custom TypeDoc plugins used by the project.

This marks everything under an "internal" folder as @internal,
telling users using the documentation that they are not for public use.

If you do not want @internal items to be in the documentation at all,
you can just append "--excludeInternal" to the end of package.json's "doc"
script.
For example, "doc"'s value would be set to
"typedoc --options typedoc.config.js --excludeInternal".

## Exports

The build is exported via package.json's exports field.

The template in its original form looks like this:
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

### Exports Object

The first two properties in the exports object are always added
by the update-exports script by default.

The first property, "./package.json", makes it possible for users to
import package.json if they want to:
```TypeScript
import package from "@my_scope/package_name/package.json"
```

The second property, "./*", makes it possible to import any file module
built to the "dist" folder.
For example, if you wanted to import module "math/Matrix4",
you could do so via:
```TypeScript
import { Matrix4 } from "@my_scope/package_name/math/Matrix4"
```

This will result in it importing Matrix4 from module "./dist/math/Matrix4.mjs".

### Modules Objects

Each module object has properties "types", "require", and "import".

- "types" gives a path indicating that all files with extension ".d.ts"
inside of some folder provide the type definitions of this module.
- "require" gives a path indicating that all files with extension ".cjs"
inside of some folder provide the CommonJS version of this module.
- "import" gives a path indicating that all files with extension ".mjs"
inside of some folder provide the ES version of this module.

### Internal Modules

By setting an export to "null", you can block the ability to import it.

Whenever you add new "internal" modules, you can just use the
"update-exports" script to programmatically update the exports object
to mark them as null:
```console
npm run update-exports
```

Calling it on the original project will result in the exports field looking like:
```TypeScript
    //...
    "exports": {
        "./package.json": "./package.json",
        "./*": {
            "types": "./dist/*.d.ts",
            "require": "./dist/*.cjs",
            "import": "./dist/*.mjs"
        },
        "./math/algorithms/internal": null
    }
    //...
```

### Exports Reset

If you end up messing up your exports field and want to reset it to
the above value, you can use the following console command:

```console
npm run reset-exports
```

It runs a project script to read in package.json and reset the exports
field to the original value of the template.

## Jest

This project uses
[Jest](https://www.npmjs.com/package/jest)
for testing.

The Jest config file is located at
["{project}/config/build/jest.config.js"](https://github.com/Crow281/ts-file-module-template/blob/main/config/build/jest.config.js).
The reason it isn't in its own "{project}/config/test" folder is due to the
fact that it needs to be able to find the babel config file,
so they were added to the same folder.

All test scripts are placed in files with the following format:
"src/../{FolderWithTestedModule}/__test__/{TestedModule}/{TestName}.test.ts"
