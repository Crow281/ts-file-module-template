# Configuration

This document explains how the template is setup and the rationale behind it.

## Rollup

This template uses Rollup as the overall bundler.

The Rollup config file is located at
["{project}/config/rollup.config.mjs"](https://github.com/Crow281/ts-folder-module-template/tree/main/config/rollup.config.mjs).

The config file will get a list of every source file under
["{project}/src"](https://github.com/Crow281/ts-folder-module-template/tree/main/src)
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
["{project}/dist"](https://github.com/Crow281/ts-folder-module-template/tree/main/dist)
folder, using the same subfolders as their sources.
For example, the builds for all scripts under folder "src/some-module"
will be placed in "dist/some-module".

## Babel

This template hooks Rollup to Babel to handle the actual compiling,
converting TypeScript source files into JavaScript module files and
helping to ensure backwards compatibility.

The Babel config file is located at
["{project}/config/babel.config.json"](https://github.com/Crow281/ts-folder-module-template/tree/main/config/babel.config.json).

It includes presets to let it handle React and TypeScript.

## TypeScript

While Babel is used to handle the actual task of transpiling TypeScript
code to JavaScript, TypeScript itself is still used to create the
definition files.

### Config

The main TypeScript configuration file is in
["{project}/tsconfig.json"](https://github.com/Crow281/ts-folder-module-template/tree/main/tsconfig.json).

In order to leave "__test__" folders out of the final build but
ensure your editor recognizes them as typescript files,
there is a second config file extending it inside of
["{project}/config/tsconfig.production.json"](https://github.com/Crow281/ts-folder-module-template/tree/main/config/tsconfig.production.json)
used for the actual build.

### Custom File Extensions

In the event that you need to support importing custom file extensions,
you can leave the type definition files for them inside of the
["{project}/config/types"](https://github.com/Crow281/ts-folder-module-template/tree/main/config/types)
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

## ESLint

This template uses ESLint to check for any coding problems.

The ESLint config file is located in
["{project}/config/eslint.config.mjs"](https://github.com/Crow281/ts-folder-module-template/tree/main/config/eslint.config.mjs).

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

This template uses Prettier to keep the formatting consistent.

The Prettier config file is located in
["config/.prettierrc.json"](https://github.com/Crow281/ts-folder-module-template/tree/main/config/.prettierrc.json).

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

This template uses Typedoc to generate documentation for the source files.

It uses two custom plugins.

### config/TypeDocRootModule.js

This moves all the modules to under a "root" folder, "./" and converts any
"index.ts" at the root into the root module.

So if for example your file structure looked like:

```
- {project}
-- src
--- math
--- printing
--- index.ts
--- PackageName.ts
```

Typedoc would present:
```
- .
-- math
-- printing
-- PackageName
```

As opposed to:
```
- index
- math
- printing
- PackageName
```

### config/TypeDocTagInternal.js

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
```json
    ...
    "exports": {
        "./package.json": "./package.json",
        "./*": {
            "types": "./dist/*.d.ts",
            "require": "./dist/*.cjs",
            "import": "./dist/*.mjs"
        }
    }
    ...
```

### Exports Object

The first two properties in the exports object are always added
by the update-exports script by default.

The first property, "./package.json", makes it possible for users to
import package.json if they want to:
```ts
import package from "@my_scope/package_name/package.json"
```

The second property, "./*", makes it possible to import any file module
built to the "dist" folder.
For example, if you wanted to import module "math/Matrix4",
you could do so via:
```ts
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
```json
    ...
    "exports": {
        "./package.json": "./package.json",
        "./*": {
            "types": "./dist/*.d.ts",
            "require": "./dist/*.cjs",
            "import": "./dist/*.mjs"
        },
        "./math/algorithms/internal": null
    }
    ...
```

### Exports Reset

If you end up messing up your exports field and want to reset it to
the above value, you can use the following console command:

```console
npm run reset-exports
```

It runs a project script to read in package.json and reset the exports
field to the original value of the template.
