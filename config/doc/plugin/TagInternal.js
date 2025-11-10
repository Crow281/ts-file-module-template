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
/**
 * This is a TypeDoc plugin designed to mark all modules
 * with "/internal/" in their path with the internal tag.
 *
 * This plugin was last updated for TypeDoc version 0.28.2.
 */
import { Application, Comment, Context, Converter } from "typedoc";

/**
 * Plugin that marks anything childed to any folder named "internal"
 * as internal.
 */
class TagInternalPlugin {
    /**
     * Marks reflection and all children as internal.
     * @param {*} reflection
     */
    static markInternal(reflection) {
        //Make sure it has an internal tag.
        //Fetch the module's comment object.
        let comment = reflection.comment;

        //If reflection has a comment.
        if (comment) {
            //Fetch modifier tags.
            let modifierTags = comment.modifierTags;

            //Ensure that "@internal" is one of the modifier tags.
            modifierTags.add("@internal");

            //If reflection does NOT have a comment.
        } else {
            //Create set for modifier tags.
            const modifierTags = new Set();

            //Add internal to it.
            modifierTags.add("@internal");

            //Create the comment with internal in it.
            comment = new Comment([], [], modifierTags);

            //Save it to the reflection.
            reflection.comment = comment;
        }
    }

    /**
     * Marks item and all of its children as internal.
     * @param {*} rootReflection
     */
    static markAllChildrenInternal(rootReflection) {
        //Create a stack of all objects to iterate.
        const stack = [rootReflection];

        //Iterate the stack.
        while (stack.length > 0) {
            //Fetch next item to mark as internal.
            const reflection = stack.pop();

            //Mark it as internal.
            TagInternalPlugin.markInternal(reflection);

            //If item has any children.
            if (reflection.children) {
                //Add children to stack.
                stack.push(...reflection.children);
            }
        }
    }

    /**
     * Checks if the module in question is an internal file.
     * @param {DeclarationReflection} declaration
     * Module we want the path for.
     * @returns
     * The path this belongs to.
     */
    static #isInInternalFolder(declaration) {
        //Source files for this module.
        const sources = declaration.sources;

        //If this does not have any source files.
        if (!sources || sources.length <= 0) {
            //Then it is probably not internal.
            return false;
        }

        //RegExp used to detect items with "internal" in the path of their name.
        const regExp = /(^|\/)internal(\/|$)/;

        //Iterate sources and return when we find a suitable name.
        for (const source of sources) {
            //If this source file is in an internal folder.
            if (regExp.test(source.fileName)) {
                //Return that it is internal.
                return true;
            }
        }

        //If we didn't find any matches, then it probably isn't internal.
        return false;
    }

    /**
     * Application plugin is bound to.
     */
    #application;

    /**
     *
     */
    constructor() {
        //
    }

    /**
     * Binds plugin to the given typescript app.
     * @param {Application} application
     * TypeScript application to bind this plugin to.
     * @throws {@link Error}
     * If already bound to an application.
     */
    bind(application) {
        //If already bound, fail.
        if (this.#application) {
            throw new Error("Plugin is already bound.");
        }

        //Save application
        this.#application = application;

        //Bind to events.
        //Fetch object events are bound via.
        const converter = application.converter;

        //Listen for when Typedoc is about to assemble everything.
        converter.on(
            Converter.EVENT_CREATE_DECLARATION,
            this.#onCreateDeclaration,
        );
    }

    /**
     * Cleans up hooks to typescript application.
     */
    unbind() {
        //Do nothing if not bound.
        if (!this.#application) {
            return;
        }

        //Fetch application.
        const application = this.#application;

        //Erase application.
        this.#application = undefined;

        //Unbind from events.
        //Fetch object events are bound via.
        const converter = application.converter;

        //Erase all events we are bound to.
        converter.off(
            Converter.EVENT_CREATE_DECLARATION,
            this.#onCreateDeclaration,
        );
    }

    /**
     * Called when typedoc creates a new reflection object.
     *
     * Adds internal tag to all typedoc modules in "Internal" folders.
     * @param {Context} context
     * Typedoc context running this.
     * @param {DeclarationReflection} declaration
     * Newly created typedoc reflection object.
     */
    #onCreateDeclaration = (context, declaration) => {
        //Check if this declaration is in an internal folder.
        const isInInternal = TagInternalPlugin.#isInInternalFolder(declaration);

        //If this item is internal.
        if (isInInternal) {
            //Mark it as internal.
            TagInternalPlugin.markInternal(declaration);
        }
    };
}

/**
 * Allows TypeDoc to access the plugin.
 * @param {Application} app
 */
export function load(app) {
    //Create an instance of the plugin.
    const plugin = new TagInternalPlugin();

    //Connect it to the app.
    plugin.bind(app);
}
