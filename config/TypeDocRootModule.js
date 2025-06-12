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
 * This is a TypeDoc plugin designed to move all the folders to
 * under a root module.
 * 
 * For example, module "SomeFolder1/SomeFolder2/SomeModule"
 * will become "./SomeFolder1/SomeFolder2/SomeModule"
 * 
 * This plugin was last updated for TypeDoc version 0.28.2.
 */
import {
    Application,
    Comment,
    Context,
    Converter,
    DeclarationReflection,
    ReflectionKind
} from "typedoc";

//What to name the root module.
const ROOT_NAME = ".";

/**
 * Plugin used to move the modules to a root.
 */
class RootModulePlugin {
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

        //Listen for when Typedoc has created a reflection.
        converter.on(
            Converter.EVENT_CREATE_DECLARATION,
            this.#onCreateDeclaration
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
            this.#onCreateDeclaration
        );
    }

    /**
     * Called when typedoc creates a new reflection object.
     * @param {Context} context 
     * Typedoc context running this.
     * @param {DeclarationReflection} declaration 
     * Newly created typedoc reflection object.
     */
    #onCreateDeclaration = (context, declaration) => {
        //If this declaration is a module.
        if (declaration.kindOf(ReflectionKind.Module)) {
            //Fetch the current name of this module.
            const name = declaration.name;

            //Records the new name we are giving this module.
            let newName;
            
            //If this is anything other than the root index module.
            if (name !== "index") {
                //Move the module name to under root.
                newName = ROOT_NAME + "/" + name;

                //If this is the root index module.
            } else {
                //Make the module name into root.
                newName = ROOT_NAME;
            }
            
            //Give the module its new name.
            declaration.name = newName;
        }
    }

}

/**
 * Allows TypeDoc to access the plugin.
 * @param {Application} app 
 */
export function load(app) {
    //Create an instance of the plugin.
    const plugin = new RootModulePlugin();

    //Connect it to the app.
    plugin.bind(app);
}
