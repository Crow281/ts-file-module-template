# User Guide

This tutorial gives instructions to make the template project your own.

## Setup

Download a copy of the repository:
```console
git clone https://github.com/Crow281/ts-file-module-template.git
```

You can probably just delete all files under the "src" folder since
you presumably won't be needing the example files under it
for your own project.

Likewise, you should just delete most of the files under the "doc" folder,
though you might want to keep the
[{project}/doc/Scripts.md](https://github.com/Crow281/ts-file-module-template/blob/main/doc/Scripts.md)
file since it serves as a general purpose guide to the project's development scripts.

You will probably want to replace "README.md", "CHANGELOG.md",
and "LICENSE" with your own files.

## CHANGELOG.md

Whenever you publish a new version of your package, you will want to update
[{project}/CHANGELOG.md](https://github.com/Crow281/ts-file-module-template/blob/main/CHANGELOG.md).

One recommended guide is
[here](https://keepachangelog.com/).

## NPM Dependency Update

You can use the following console command to update the project for
any minor version changes to its devDependencies and dependencies.
```console
npm update
```

You can use the following console command to check if any of the
project's dependencies are outdated, especially in terms of major versions:
```console
npm outdated
```

You can use the following console command to download
this project's node_modules:
```console
npm install
```

As for the project's peerDependencies, you will want to keep
the version range as flexible as what your library supports,
so barring a need for new library features,
you will probably just be adding "| ^{newMajorVersion}.0.0"
to updated peerDependencies.

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
            <p>
                If you are not planning to use React, then you can safely remove
                packages
                "@babel/preset-react" and
                "eslint-plugin-react".
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

[Open this guide](https://github.com/Crow281/ts-file-module-template/blob/main/doc/Scripts.md)
for details on how to use it.

### Removal

If you are NOT using JSON Schema, then you can use the
following steps to clean it from your project:

1. Delete folder ["{project}/config/generate"](https://github.com/Crow281/ts-file-module-template/tree/main/config/generate).
2. Delete the following list of packages from package.json's list of devDependencies/dependencies:
    * @apidevtools/json-schema-ref-parser
    * ajv
    * ajv-formats
    * json-schema-to-typescript
3. Modify package.json's scripts section and delete all the generate scripts.
```TypeScript
    //...
    "scripts": {
        "generate:json-schema:id-mapping": "tsx ./config/generate/json-schema/bin/GenerateIDMapping.ts",
        "generate:json-schema:interfaces": "tsx ./config/generate/json-schema/bin/GenerateSchemaInterfaces.ts",
        "generate:json-schema:validators": "tsx ./config/generate/json-schema/bin/GenerateValidators.ts",
        "generate:json-schema": "npm run generate:json-schema:id-mapping && npm run generate:json-schema:interfaces && npm run generate:json-schema:validators",
        "generate": "npm run clean:generated && npm run generate:json-schema",
        //...
    }
    //...
```
4. Delete the Generate section from document ["{project}/doc/Scripts.md"](https://github.com/Crow281/ts-file-module-template/blob/main/doc/Scripts.md).

## Scripts

To learn how to use all NPM project scripts, such as test and build, you can
[open this guide](https://github.com/Crow281/ts-file-module-template/blob/main/doc/Scripts.md).
