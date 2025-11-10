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
            ["config/generate/json-schema/GenerateSchemaInterfaces.ts"](https://github.com/Crow281/ts-file-module-template/tree/main/config/generate/json-schema/GenerateSchemaInterfaces.ts)
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
            Pollyfills Babel helper code while Babel transpiles.
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
            Library used by generate code to create
            validation code.
            This library is not needed if you are not using JSON Schema
            in the first place.
        </td>
    </tr>
    <tr>
        <td>
            ajv-formats
        </td>
        <td>
            Library used by JSON Schema validation code
            to validate formats.
            This library is not needed if you are not using JSON Schema
            in the first place.
            You will need to move this to dependencies if any of the
            validation functions need it.
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
            ["config/generate/json-schema/GenerateSchemaInterfaces.ts"](https://github.com/Crow281/ts-file-module-template/tree/main/config/generate/json-schema/GenerateSchemaInterfaces.ts)
            to convert JSON schema into equivalent TypeScript interfaces.
        </td>
    </tr>
    <tr>
        <td>
            prettier
        </td>
        <td>
            Handles fixing code formatting.
        </td>
    </tr>
    <tr>
        <td>
            rimraf
        </td>
        <td>
            Handles cleaning files the project no longer needs.
        </td>
    </tr>
    <tr>
        <td>
            rollup
        </td>
        <td>
            Handles the build process.
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
            typedoc
        </td>
        <td>
            Scans source files and TSDoc comments and creates
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
            Is used to create TypeScript definition files.
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

Libraries the project's build is dependant on.

<table>
    <tr>
        <th>
            Package
        </th>
        <th>
            Use
        </th>
    </tr>
</table>
