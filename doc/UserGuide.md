# User Guide

This tutorial gives instructions to make the template project your own.

## Setup

Download a copy of the repository:
```console
git clone https://github.com/Crow281/ts-file-module-template.git
```

You can probably just delete all files under the "doc" and "src" folders since
you presumably won't be needing the example files under them
for your own project.

Likewise, you will probably want to replace "README.md", "CHANGELOG.md",
and "LICENSE" with your own files.

You can use the following console command to update the project for
any minor version changes to its dependencies.
```console
npm update
```

You can use the following console command to check if any of the
project's dependencies are outdated:
```console
npm outdated
```

You can use the following console command to download
this project's node_modules:
```console
npm install
```

### CHANGELOG.md

Whenever you publish a new version of your package, you will want to update
[{project}/CHANGELOG.md](https://github.com/Crow281/ts-file-module-template/blob/main/CHANGELOG.md).

One recommended guide is
[here](https://keepachangelog.com/).

## Package.json

Now you will want to go open your repository's copy of
[package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
and modify it for your own project.

The properties you will want to consider changing include the following:

<table>
    <tr>
        <th>
            Property
        </th>
        <th>
            Description
        </th>
    </tr>
    <tr>
        <td>
            name
        </td>
        <td>
            Name that uniquely distinguishes this NPM package.
        </td>
    </tr>
    <tr>
        <td>
            private
        </td>
        <td>
            Blocks NPM from publishing your package if set to true,
            ensuring you do not accidentally publish an NPM package
            you did not intend to publish.
        </td>
    </tr>
    <tr>
        <td>
            author
        </td>
        <td>
            Name of the person who created the package.
        </td>
    </tr>
    <tr>
        <td>
            contributors
        </td>
        <td>
            Names of the people who created the package.
        </td>
    </tr>
    <tr>
        <td>
            description
        </td>
        <td>
            A description of your project allowing people to find it via search.
        </td>
    </tr>
    <tr>
        <td>
            keywords
        </td>
        <td>
            A list of keywords you want to associate with your project,
            allowing people to find it via search.
        </td>
    </tr>
    <tr>
        <td>
            license
        </td>
        <td>
            Legal permissions under which you are distributing this package.
        </td>
    </tr>
    <tr>
        <td>
            homepage
        </td>
        <td>
            URL pointing to the main page for this project.
        </td>
    </tr>
    <tr>
        <td>
            bugs
        </td>
        <td>
            URL pointing to where people can file bug reports.
        </td>
    </tr>
    <tr>
        <td>
            repository
        </td>
        <td>
            URL pointing to where people can download copies of this project.
        </td>
    </tr>
    <tr>
        <td>
            files
        </td>
        <td>
            <p>
                List of files that should be uploaded if you are publishing your
                NPM package.
                The initial value will probably be enough under most circumstances.
            </p>
            <p>
                The initial value submits the actual built modules,
                the source code behind them, the license, and the Read Me.
                It is set to NOT submit any tsbuildinfo files, which are
                only needed by the TypeScript compiler to
                keep track of what has been built.
            </p>
        </td>
    </tr>
    <tr>
        <td>
            sideEffects
        </td>
        <td>
            A non-standard field used by some bundlers to identify side effect
            files when tree-shaking (getting rid of unused code).
            Side effects are scripts that modify stuff outside themselves.
            This property can be:
            <table>
                <tr>
                    <td>
                        true
                    </td>
                    <td>
                        All files have side effects.
                    </td>
                </tr>
                <tr>
                    <td>
                        false
                    </td>
                    <td>
                        No files have side effects.
                    </td>
                </tr>
                <tr>
                    <td>
                        string[]
                    </td>
                    <td>
                        List of source files with side effects.
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>
            devDependencies
        </td>
        <td>
            <p>
                List of NPM packages needed to develop this package
                but are NOT needed for the final distribution.
            </p>
            <p>
                For example, a person working on the project itself might
                use ESLint to look for problems in the project's source code.
                But unless the compiled project is an ESLint plugin,
                it doesn't need ESLint to run and as such end users don't need to install it.
            </p>
            <p>
                If you are not using
                <a href="https://json-schema.org/">
                    JSON Schema
                </a>
                files, then you may as well
                delete "ajv" and "ajv-formats" from it since that is
                what the libraries in question are used to handle.
            </p>
        </td>
    </tr>
    <tr>
        <td>
            dependencies
        </td>
        <td>
            <p>
                List of NPM packages the project's distribution is specifically dependant on.
            </p>
            <p>
                These are packages that people importing your library also need
                in order to use the library.
            </p>
            <p>
                By default, this project only has 1 dependency, "@babel/runtime".
                Babel defines several helper functions to increase the code's
                compatibility across platforms.
                This project is set to import these helpers from this dependency.
                That way, if a project has multiple dependencies that are also
                reliant on the babel runtime, they can simply import the same helper code
                instead of each of them defining it internally.
            </p>
            <p>
                If you plan to use JSON Schema Formats, you should
                also move package "ajv-formats" from devDependencies
                to dependencies.
            </p>
        </td>
    </tr>
    <tr>
        <td>
            peerDependencies
        </td>
        <td>
            <p>
                List of NPM packages the project's distribution is dependant on.
            </p>
            <p>
                This is similar to dependencies.
                The difference is that you use peerDependencies instead of
                dependencies when having multiple different versions of the
                dependency in your project imported by different packages would cause problems.
            </p>
            <p>
                peerDependencies are most useful for plugin libraries.
                For example, if you wanted to build a custom widget library over
                an overall UI library, like React, you would define React as a peerDependency.
                That way, when the user imports multiple custom React widget
                packages, they can then pick which mutually compatible version of React
                to use, which all the custom widget libraries will then share.
            </p>
            <p>
                By default, this project has no peerDependencies.
            </p>
        </td>
    </tr>
    <tr>
        <td>
            peerDependenciesMeta
        </td>
        <td>
            <p>
                Can be used to define peerDependencies as optional.
                When a peerDependency is marked as optional,
                that will make it so that NPM does not install it by default.
            </p>
            <p>
                One reason to use this is if your library has optional features dependant on optional packages.
                For example, maybe your library provides a custom new
                <a href="https://en.wikipedia.org/wiki/Query_language">Query language</a>.
                Your library is designed to operate over multiple backends.
                There might be one
                <a href="https://en.wikipedia.org/wiki/Adapter_pattern">adapter</a>
                that converts your Query Language
                to save to a file system, another adapter that saves to
                <a href="https://en.wikipedia.org/wiki/MySQL">MySQL databases</a>,
                and another adapter that saves to
                <a href="https://en.wikipedia.org/wiki/SQLite">SQLite databases</a>.
                End users are only likely to need one of these adapters.
                Thus, you can declare each database package it has an adapter for
                to be an optional peerDependency.
            </p>
        </td>
    </tr>
</table>

## Modules

Every file represents a file module.

### Internal Modules

If you want a folder full of code that should NOT be directly accessible
to the public, intended only for use by the library itself,
you can name it "internal".

The Rollup build script will not include any entries for scripts
inside of internal folders. However, if non-internal scripts
reference them, then it will build them to JS files which
the non-internal scripts can then import.

## JSON Schema

[JSON Schema](https://json-schema.org/)
is a file format used to define
the correct structure for a type of JSON document.
This project contains several scripts for dynamically generating code for
JSON Schema files.

For example, if you have a file,
{project}/src/some/module/SomeSchema.schema.json,
you can use the following command to generate
a TypeScript interface representing the data
the schema represents,
a validation function verifying that a given
JSON object matches the schema,
and an object mapping all JSON Schema ids
to the corresponding JSON Schema:

```console
npm run generate
```

This will result in the creation of the following files:
- {project}/src/some/module/SomeSchema.ts
- {project}/src/some/module/ValidateSomeSchema.ts
- {project}/src/internal/IDToJSONSchema.ts

When running generate, you might notice the following error message:

```console
The following generated JSON Schema validators are dependant on NPM package "ajv-formats":
```

This happens when your JSON Schema code wants to validate a format,
but you do not have the "ajv-formats" package needed to do so
set as a project dependency.
You are advised to follow the warning's instructions to install
or move it.

If you are NOT using JSON Schema, then you can delete folder
{project}/config/generate
and then use the knip tool, mentioned below,
to find anything else you can remove from your project.

## Knip

To find any unused dependencies,
use the following console command:

```console
npm run knip
```

The knip config file is located at: 
[{project}/config/knip/knip.config.ts](https://github.com/Crow281/ts-file-module-template/tree/main/config/knip/knip.config.ts)

If you have a package that is being used in a way that knip cannot
detect, then you can add its name to config property
ignoreDependencies.

If one of your files is conducting a valid import in a way that
knip does not recognize, then you can add it to config property
ignoreUnresolved.

## Linting

To detect possible problems in your source code,
use the following console command:

```console
npm run lint
```

## Formatting

To keep the formatting of your code consistent,
your imports organized, etc, you can
use the following console command:

```console
npm run format
```

## Building

When you want to compile your code into JavaScript Modules for external use,
use the following console command:

```console
npm run build
```

This will transpile all of your code into ES and CommonJS modules,
allowing others to export them.
They will be saved to the dist folder.

## Cleaning

If for some reason you need to erase your current build, one option is
to use the following console command:

```console
npm run clean
```

## Testing

This project uses
[Jest](https://www.npmjs.com/package/jest)
for its test scripts.

You can write unit tests by adding a "__tests__"
folder,
adding ".test.ts" files to it, and writing your
tests inside of them.

An example is located
[here](https://github.com/Crow281/ts-file-module-template/tree/main/src/math/linear-algebra/algorithms/__tests__/),
which contains tests to make sure the code inside of
"src/math/linear-algebra/algorithms" is behaving as expected.

When you want run your tests to ensure your source changes haven't broken
anything, you can use the following console command:

```console
npm run test
```

### Test All Versions

Note that this script is expensive, so it's most efficient to only use it when about to publish.
Whenever you are about to publish, you should run the regular test first.
Once you've verified that your project works normally by default,
you can use this script to make sure that all accepted version ranges of your NPM dependencies work too:

```console
npm run test-all-versions
```

## Documentation

You can use TypeDoc to build the documentation via:

```console
npm run doc
```

This command will output it to
"{project}/doc/api/latest"
as a series of web pages.

As a live example, the template project provides the API
for the sample code via GitHub Pages.
It is located
[here](https://crow281.github.io/ts-file-module-template/doc/api/latest).
Github hosts the files located
[here](https://github.com/Crow281/ts-file-module-template/tree/gh-pages/).

If you want to do the same:
- Create your own new branch called "gh-pages".
- Commit the web resources generated by TypeDoc somewhere on this branch.
- Go to the project's settings and click on the "Pages" button
to open the GitHub Pages menu. You can select the "gh-pages" branch
to host it.
