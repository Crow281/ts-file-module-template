# User Guide

This tutorial gives instructions to make the template project your own.

## Setup

Download a copy of the repository:
```console
git clone https://github.com/Crow281/ts-folder-module-template.git
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
            List of files that should be uploaded if you are publishing your
            NPM package.
            The initial value will probably be enough under most circumstances.
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
</table>

## Modules

Every file except "index.ts" represents a file module.

### Folder Modules
"index.ts" represents the overall folder. If you want to document a folder,
you can add a @packageDocumentation tag, like below:
```ts
/// index.ts
/**
 * This comment describes this folder module.
 * 
 * The below tag, "packageDocumentation", marks this comment as
 * being part of the module.
 * @packageDocumentation
 */
```

While the option is technically open, I advise that you NOT use the "index.ts"
files as barrel files.

### Internal Modules

If you want a folder full of code that should NOT be directly accessible
to the public, intended only for use by the library itself,
you can name it "internal".

You can then call the following script to update package.json's exports field
to disable access to any folder marked "internal" and any of its subfolders.
This script will disable access by adding the path to these folders
to the exports field and setting them to null.
```console
npm run update-exports
```

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
[here](https://crow281.github.io/ts-folder-module-template/src/math/algorithms/__tests__),
which contains tests to make sure the code inside of
"math/algorithms" is behaving as expected.

When you want run your tests to ensure your source changes haven't broken
anything, you can use the following console command:

```console
npm run test
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
[here](https://crow281.github.io/ts-folder-module-template/doc/api/latest).
Github hosts the files located
[here](https://github.com/Crow281/ts-folder-module-template/tree/gh-pages).

If you want to do the same:
- Create your own new branch called "gh-pages".
- Commit the web resources generated by TypeDoc somewhere on this branch.
- Go to the project's settings and click on the "Pages" button
to open the GitHub Pages menu. You can select the "gh-pages" branch
to host it.
