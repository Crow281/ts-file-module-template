# Dependencies

A list of libraries this project is dependant on and why.

## devDependencies

Libraries this project is dependant on for building.

<table>
    <tr>
        <th>
            Package
        </th>
        <th>
            Use
        </th>
    </tr>
    <tr>
        <td>
            @apidevtools/json-schema-ref-parser
        </td>
        <td>
            Is used by script
            <a href="https://github.com/Crow281/ts-file-module-template/blob/main/config/generate/json-schema/bin/GenerateSchemaInterfaces.ts">
                "{project}/config/generate/json-schema/bin/GenerateSchemaInterfaces.ts"
            </a>
            to fetch external schema files while creating the interfaces.
        </td>
    </tr>
    <tr>
        <td>
            @babel/core
        </td>
        <td>
            Is used to transpile the source code into modules.
        </td>
    </tr>
    <tr>
        <td>
            @babel/plugin-transform-runtime
        </td>
        <td>
            Enables Babel to reuse polyfilled helper code while transpiling by importing from a dependency, @babel/runtime.
        </td>
    </tr>
    <tr>
        <td>
            @babel/preset-env
        </td>
        <td>
            Enables Babel to polyfill missing features across environments.
        </td>
    </tr>
    <tr>
        <td>
            @babel/preset-react
        </td>
        <td>
            Enables Babel to transpile React.
        </td>
    </tr>
    <tr>
        <td>
            @babel/preset-typescript
        </td>
        <td>
            Enables Babel to transpile TypeScript.
        </td>
    </tr>
    <tr>
        <td>
            @eslint/js
        </td>
        <td>
            Enables ESLint to check JavaScript code.
        </td>
    </tr>
    <tr>
        <td>
            @jest/globals
        </td>
        <td>
            Dependency of Jest, is explicitly imported so that
            my test scripts can explicitly import jest functions.
        </td>
    </tr>
    <tr>
        <td>
            @rollup/plugin-babel
        </td>
        <td>
            Rollup plugin allowing the build script to tap
            into Babel for transpiling, converting source
            code into JavaScript library modules.
        </td>
    </tr>
    <tr>
        <td>
            @rollup/plugin-commonjs
        </td>
        <td>
            Rollup plugin that allows build script to convert
            CommonJS modules to ES Modules.
        </td>
    </tr>
    <tr>
        <td>
            @rollup/plugin-dsv
        </td>
        <td>
            Rollup plugin that converts CSV and TSV files into
            constant variables that can be used in your library.
        </td>
    </tr>
    <tr>
        <td>
            @rollup/plugin-json
        </td>
        <td>
            Rollup plugin that converts JSON files into
            constant variables that can be used in your library.
        </td>
    </tr>
    <tr>
        <td>
            @rollup/plugin-node-resolve
        </td>
        <td>
            Rollup plugin that allows build script to find 3rd party
            modules using node resolution,
            such as those inside of node_modules.
        </td>
    </tr>
    <tr>
        <td>
            @trivago/prettier-plugin-sort-imports
        </td>
        <td>
            Used by the format script to sort all the imports in the project.
        </td>
    </tr>
    <tr>
        <td>
            @types/jest
        </td>
        <td>
            Gives access to the types of the Jest
            library when building test scripts.
        </td>
    </tr>
    <tr>
        <td>
            ajv
        </td>
        <td>
            <p>
                Library used by generate code to create
                validation code.
            </p>
            <p>
                This library is not needed if you are not using JSON Schema
                in the first place.
            </p>
        </td>
    </tr>
    <tr>
        <td>
            ajv-formats
        </td>
        <td>
            <p>
                Library used by JSON Schema validation code
                to validate formats.
            </p>
            <p>
                This library is not needed if you are not using JSON Schema
                in the first place.
            </p>
            <p>
                You will need to move this to peerDependencies if any of the
                validation functions need it.
            </p>
        </td>
    </tr>
    <tr>
        <td>
            babel-jest
        </td>
        <td>
            Plugin that allows test library, Jest, to transpile via Babel.
        </td>
    </tr>
    <tr>
        <td>
            copyfiles
        </td>
        <td>
            Enables project to copy custom generated
            Type Definition files (.d.ts) in the
            source directory over to the dist/types folder.
        </td>
    </tr>
    <tr>
        <td>
            eslint
        </td>
        <td>
            Tool to check code for formatting problems.
        </td>
    </tr>
    <tr>
        <td>
            eslint-config-prettier
        </td>
        <td>
            Disables ESLint rules that risk conflicting with
            Prettier when formatting the code.
        </td>
    </tr>
    <tr>
        <td>
            eslint-plugin-react
        </td>
        <td>
            Enables ESLint to check React code.
            The project is designed to be able to
            handle ignoring it if eslint-plugin-react
            is not installed.
        </td>
    </tr>
    <tr>
        <td>
            glob
        </td>
        <td>
            A library that makes it possible to search files via
            glob patterns.
            Is used by several of the project's scripts to
            locate necessary files.
        </td>
    </tr>
    <tr>
        <td>
            globals
        </td>
        <td>
            Needed by ESLint to look up global variables.
        </td>
    </tr>
    <tr>
        <td>
            jest
        </td>
        <td>
            Library used to handle test scripts.
        </td>
    </tr>
    <tr>
        <td>
            json-schema-to-typescript
        </td>
        <td>
            Enables script
            <a href="https://github.com/Crow281/ts-file-module-template/blob/main/config/generate/json-schema/bin/GenerateSchemaInterfaces.ts">
                "{project}/config/generate/json-schema/bin/GenerateSchemaInterfaces.ts"
            </a>
            to convert JSON schema into equivalent TypeScript interfaces.
        </td>
    </tr>
    <tr>
        <td>
            knip
        </td>
        <td>
            Tool to find unused dependencies.
        </td>
    </tr>
    <tr>
        <td>
            prettier
        </td>
        <td>
            Tool to fix code formatting.
        </td>
    </tr>
    <tr>
        <td>
            rimraf
        </td>
        <td>
            Tool to delete files the project no longer needs.
        </td>
    </tr>
    <tr>
        <td>
            rollup
        </td>
        <td>
            Tool to build the project.
        </td>
    </tr>
    <tr>
        <td>
            rollup-plugin-includepaths
        </td>
        <td>
            Enables Rollup to lookup source files
            from paths relative to the source folders.
        </td>
    </tr>
    <tr>
        <td>
            rollup-plugin-node-externals
        </td>
        <td>
            Tells Rollup which imports reference code outside the project.
        </td>
    </tr>
    <tr>
        <td>
            tsx
        </td>
        <td>
            Tool to let NPM project run TypeScript files without compiling them.
        </td>
    </tr>
    <tr>
        <td>
            typedoc
        </td>
        <td>
            Tool to scans source files and TSDoc comments and create
            web pages documenting them.
        </td>
    </tr>
    <tr>
        <td>
            typedoc-plugin-mdn-links
        </td>
        <td>
            Enables TypeDoc to link MDN types in your source code
            to a public documentation site for them.
        </td>
    </tr>
    <tr>
        <td>
            typescript
        </td>
        <td>
            Tool to create TypeScript definition files.
        </td>
    </tr>
    <tr>
        <td>
            typescript-eslint
        </td>
        <td>
            Enables ESLint to check TypeScript code.
        </td>
    </tr>
</table>

### dependencies

Libraries the project's distribution is dependant on.

<table>
    <tr>
        <th>
            Package
        </th>
        <th>
            Use
        </th>
    </tr>
    <tr>
        <td>
            @babel/runtime
        </td>
        <td>
            Babel defines helpers to increase compatibility across platforms.
            They can either be defined inside the library itself
            or they can be imported from the @babel/runtime library.
            Picking the latter allows multiple dependencies also relying on babel
            to share the same code.
        </td>
    </tr>
</table>

### peerDependencies
