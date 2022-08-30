/* eslint
    "@typescript-eslint/no-shadow": "off"
 */
import * as pl from "pareto-core-lib"
import * as pc from "pareto-core-candidates"

import * as tth from "astn-typedhandlers-api"
import * as h from "astn-handlers-api"

import * as api from "../interface"

import { defaultInitializeValue } from "./defaultInitializeValue"
import { MixidIn } from "./internaltypes"

export function createValueUnmarshaller<Annotation>(
    definition: tth.ValueDefinition,
    handler: tth.ITypedValueHandler<Annotation>,
    onError: (type: api.UnmarshallError, annotation: Annotation, severity: api.DiagnosticSeverity) => void,
    flagNonDefaultPropertiesFound: () => void,
    mixedIn: null | MixidIn<Annotation>,
    dummyHandlers: api.DummyHandlers<Annotation>,
): h.IValueHandler<Annotation> {


    type ValueContext<Annotation> = {
        definition: tth.ValueDefinition
        handler: tth.ITypedValueHandler<Annotation>
    }

    type IShorthandParsingState<Annotation> = {
        wrapup(
            annotation: Annotation,
            onError: (message: api.UnmarshallError, annotation: Annotation, severity: api.DiagnosticSeverity) => void
        ): void
        findNextValue(): ValueContext<Annotation> | null
        pushGroup(
            definition: tth.GroupDefinition,
            handler: tth.ITypedValueHandler<Annotation>
        ): void
        pushTaggedUnion(
            definition: tth.OptionDefinition,
            taggedUnionHandler: tth.ITypedTaggedUnionHandler<Annotation>,
            optionHandler: tth.ITypedValueHandler<Annotation>,
        ): void
    }

    type OptionContext<Annotation> = {
        definition: tth.OptionDefinition
        optionHandler: tth.ITypedValueHandler<Annotation>
        taggedUnionHandler: tth.ITypedTaggedUnionHandler<Annotation>
    }

    type PropertyContext<Annotation> = {
        name: string
        definition: tth.ValueDefinition
        handler: tth.IGroupHandler<Annotation>
    }

    type ExpectedElements<Annotation> = PropertyContext<Annotation>[]

    type GroupContext<Annotation> = {
        isOuterGroup: boolean
        elements: ExpectedElements<Annotation>
        handler: tth.IGroupHandler<Annotation>
        index: number
    }

    function createGroupContext<Annotation>(
        definition: tth.GroupDefinition,
        isOuterGroup: boolean,
        subHandler: tth.IGroupHandler<Annotation>,
    ): Context<Annotation> {
        const expectedElements: ExpectedElements<Annotation> = []
        definition.properties.forEach(() => false, (propDefinition, key) => {
            expectedElements.push({
                name: key,
                handler: subHandler,
                definition: propDefinition.value,
            })
        })
        return ["group", {
            elements: expectedElements,
            isOuterGroup: isOuterGroup,
            handler: subHandler,
            index: 0,
        }]
    }

    type Context<Annotation> =
        | ["group", GroupContext<Annotation>]
    //FIXME move option context here so tagged union onEnd can be called

    type StateImp<Annotation> = {
        stack: pc.Stack<Context<Annotation>>
        currentContext: Context<Annotation>
        optionContext: null | OptionContext<Annotation>
    }

    function createShorthandParsingState<Annotation>(
        groupDefinition: tth.GroupDefinition,
        groupHandler: tth.IGroupHandler<Annotation>,

    ): IShorthandParsingState<Annotation> {
        const stateImp: StateImp<Annotation> = {
            stack: pc.createStack(),
            currentContext: createGroupContext(
                groupDefinition,
                true,
                groupHandler
            ),
            optionContext: null,
        }
        return {
            pushTaggedUnion: (definition, taggedUnionHandler, optionHandler) => {
                stateImp.optionContext = {
                    definition: definition,
                    taggedUnionHandler: taggedUnionHandler,
                    optionHandler: optionHandler,
                }
            },
            pushGroup: (definition, handler) => {
                stateImp.stack.push(stateImp.currentContext)
                stateImp.currentContext = createGroupContext(
                    definition,
                    false,
                    handler.onGroup({
                        type: ["mixin", {}],
                        definition: definition,
                    }),
                )
            },
            wrapup: (annotation, onError) => {
                function wrapupImp(state: StateImp<Annotation>) {
                    if (stateImp.optionContext !== null) {
                        defaultInitializeValue(
                            stateImp.optionContext.definition.value,
                            stateImp.optionContext.optionHandler,
                            //onError,
                        )
                        stateImp.optionContext = null
                    }
                    switch (state.currentContext[0]) {
                        case "group":
                            const $ = state.currentContext[1]
                            const missing = $.elements.length - $.index
                            if (missing > 0) {
                                onError(
                                    ["missing elements", { elements: $.elements.slice($.index).map((ee) => ee.name) }],
                                    annotation,
                                    ["error", {}],
                                )
                                for (let x = $.index; x !== $.elements.length; x += 1) {
                                    const ee = $.elements[x]

                                    defaultInitializeValue(
                                        ee.definition,
                                        ee.handler.onProperty({
                                            key: ee.name,
                                            token: null,
                                            definition: ee.definition,
                                        }),
                                        //onError,
                                    )
                                }
                            }
                            $.handler.onClose({
                                token: $.isOuterGroup
                                    ? {
                                        token: {},
                                        annotation: annotation,
                                    }
                                    : null,
                            })
                            break
                        default:
                            pl.au(state.currentContext[0])
                    }
                    const previousContext = state.stack.pop()
                    if (previousContext !== null) {
                        state.currentContext = previousContext
                        wrapupImp(state)
                    }
                }
                wrapupImp(stateImp)
            },
            findNextValue: () => {
                function findNextValueImp(): null | ValueContext<Annotation> {
                    if (stateImp.optionContext !== null) {
                        const tmp = stateImp.optionContext
                        stateImp.optionContext = null
                        return {
                            definition: tmp.definition.value,
                            handler: tmp.optionHandler,

                        }
                    }
                    switch (stateImp.currentContext[0]) {
                        case "group":
                            const $ = stateImp.currentContext[1]
                            const ee = $.elements[$.index]
                            $.index++
                            if (ee !== undefined) {
                                return {
                                    definition: ee.definition,
                                    handler: ee.handler.onProperty({
                                        token: null,
                                        key: ee.name,
                                        definition: ee.definition,
                                    }),
                                }
                            } else {
                                //end of array of properties
                                $.handler.onClose({
                                    token: null,
                                })
                                const previousContext = stateImp.stack.pop()
                                if (previousContext === null) {
                                    return null
                                } else {
                                    stateImp.currentContext = previousContext
                                    return findNextValueImp()
                                }
                            }
                        default:
                            return pl.au(stateImp.currentContext[0])
                    }
                }
                return findNextValueImp()
            },
        }
    }

    function wrap<Annotation>(
        handler: h.IValueHandler<Annotation>,
        onMissing: () => void,
    ): h.IRequiredValueHandler<Annotation> {
        return {
            exists: handler,
            missing: (): void => {
                onMissing()
            },
        }
    }

    function createUnexpectedArrayHandler(
        message: api.UnmarshallError,
        annotation: Annotation,
    ): h.IArrayHandler<Annotation> {
        onError(message, annotation, ["error", {}])
        return dummyHandlers.array()
    }

    function createUnexpectedObjectHandler(
        message: api.UnmarshallError,
        annotation: Annotation,
    ): h.IObjectHandler<Annotation> {
        onError(message, annotation, ["error", {}])
        return dummyHandlers.object()
    }

    function createUnexpectedTaggedUnionHandler(
        message: api.UnmarshallError,
        annotation: Annotation,
    ): h.ITaggedUnionHandler<Annotation> {
        onError(message, annotation, ["error", {}])
        return dummyHandlers.taggedUnion()
    }

    function createUnexpectedStringHandler(
        message: api.UnmarshallError,
        annotation: Annotation,
    ): void {
        onError(message, annotation, ["error", {}])
    }

    function defInitializeValue() {
        defaultInitializeValue(
            definition,
            handler,
            //onError,
        )
    }
    switch (definition.type[0]) {
        case "dictionary": {
            const $d = definition.type[1]
            return {
                array: ($e) => {
                    defInitializeValue()
                    return createUnexpectedArrayHandler(
                        ["expected a dictionary", {}],
                        $e.token.annotation,
                    )
                },
                object: ($e) => {
                    const foundKeysBuilder = pc.createArrayBuilder<string>()
                    if ($e.token.token.type[0] !== "dictionary") {
                        onError(["object is not a dictionary", {}], $e.token.annotation, ["warning", {}])
                    }

                    const dictHandler = handler.onDictionary({
                        token: {
                            token: $e.token.token,
                            annotation: $e.token.annotation,
                        },
                        definition: $d,
                    })
                    return {
                        property: ($p) => {
                            if ($p.token.token.wrapping[0] !== "quote") {
                                onError(["entry key does not have quotes", {}], $p.token.annotation, ["warning", {}])
                            }
                            foundKeysBuilder.toArray().forEach(($) => {
                                if ($ === $p.token.token.value) {
                                    onError(["duplicate key", {}], $p.token.annotation, ["error", {}])
                                }
                            })
                            foundKeysBuilder.push($p.token.token.value)
                            flagNonDefaultPropertiesFound()

                            const entryHandler = dictHandler.onEntry({
                                token: {
                                    token: $p.token.token,
                                    annotation: $p.token.annotation,
                                },
                            })
                            return wrap(
                                createValueUnmarshaller(
                                    $d.value,
                                    entryHandler,
                                    onError,
                                    () => { },
                                    null,
                                    dummyHandlers,
                                ),
                                () => {
                                    defaultInitializeValue(
                                        $d.value,
                                        entryHandler,
                                        //onError,
                                    )
                                }
                            )
                        },
                        anonymousProperty: () => {
                            return dummyHandlers.value()
                        },
                        onEnd: ($ee) => {
                            dictHandler.onClose({
                                token: {
                                    token: {},
                                    annotation: $ee.token.annotation,
                                },
                            })

                        },
                    }
                },
                taggedUnion: ($e) => {
                    defInitializeValue()
                    return createUnexpectedTaggedUnionHandler(
                        ["expected a dictionary", {}],
                        $e.token.annotation,
                    )
                },
                simpleString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a dictionary", {}],
                        $e.token.annotation,
                    )
                },
                multilineString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a dictionary", {}],
                        $e.token.annotation,
                    )
                },
            }

        }
        case "list": {
            const $d = definition.type[1]
            return {
                array: ($e) => {
                    if ($e.token.token.type[0] !== "list") {
                        onError(["array is not a list", {}], $e.token.annotation, ["error", {}])
                    }
                    const listHandler = handler.onList({
                        token: {
                            token: $e.token.token,
                            annotation: $e.token.annotation,
                        },
                        definition: $d,
                    })
                    return {
                        element: ($) => {
                            flagNonDefaultPropertiesFound()
                            // const entry = collBuilder.createEntry(_errorMessage => {
                            //     //onError(errorMessage, svData)
                            // })
                            const elementSideEffects = listHandler.onElement({})
                            return createValueUnmarshaller(
                                $d.value,
                                elementSideEffects,
                                onError,
                                () => { },
                                null,
                                dummyHandlers,
                            )
                        },
                        onEnd: ($) => {
                            listHandler.onClose({
                                token: {
                                    token: {},
                                    annotation: $.token.annotation,
                                },
                            })
                        },
                    }
                },
                object: ($e) => {
                    defInitializeValue()
                    return createUnexpectedObjectHandler(
                        ["expected a list", {}],
                        $e.token.annotation,
                    )
                },
                taggedUnion: ($e) => {
                    defInitializeValue()
                    return createUnexpectedTaggedUnionHandler(
                        ["expected a list", {}],
                        $e.token.annotation,
                    )
                },
                simpleString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a list", {}],
                        $e.token.annotation,
                    )
                },
                multilineString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a list", {}],
                        $e.token.annotation,
                    )
                },
            }
        }
        case "type reference": {
            const $e = definition.type[1]
            return createValueUnmarshaller(
                $e.type.get().value,
                handler.onTypeReference({
                    definition: $e,
                }),
                onError,
                flagNonDefaultPropertiesFound,
                mixedIn,
                dummyHandlers,
            )
        }
        case "tagged union": {
            const $d = definition.type[1]
            function doOption<T>(
                optionToken: h.SimpleStringToken<Annotation>,
                definition: tth.TaggedUnionDefinition,
                tuHandler: tth.ITypedTaggedUnionHandler<Annotation>,
                unknownCallback: () => T,
                knownCallback: (option: tth.OptionDefinition, handler: tth.ITypedValueHandler<Annotation>) => T,
            ): T {
                return definition.options.find(
                    optionToken.token.value,
                    (optionDefinition) => {
                        if (optionDefinition !== definition["default option"].get()) {
                            flagNonDefaultPropertiesFound()
                        }
                        return knownCallback(
                            optionDefinition,
                            tuHandler.onOption({
                                definition: optionDefinition,
                                name: optionToken.token.value,
                                token: optionToken,
                            })
                        )
                    },
                    (keys) => {
                        onError(
                            ["unknown option", {
                                "known options": keys,
                            }],
                            optionToken.annotation,
                            ["error", {}]
                        )
                        defaultInitializeValue(
                            definition["default option"].get().value,
                            tuHandler.onUnexpectedOption({
                                defaultOption: definition["default option"].name,
                                expectedOptions: keys,
                                token: optionToken,
                                //stateGroupDefinition: $e,
                            }),
                            //onError,
                        )
                        return unknownCallback()
                    },
                )
            }
            return {
                array: ($e) => {
                    defInitializeValue()
                    return createUnexpectedArrayHandler(
                        ["expected a tagged union", {}],
                        $e.token.annotation,
                        //onError,
                        //dummyHandlers,
                    )
                },
                object: ($e) => {
                    defInitializeValue()
                    return createUnexpectedObjectHandler(
                        ["expected a tagged union", {}],
                        $e.token.annotation,
                        //onError,
                        //dummyHandlers,
                    )
                },
                taggedUnion: ($tu) => {
                    const tuHandler = handler.onTaggedUnion({
                        definition: $d,
                        token: $tu.token,
                    })
                    return {
                        option: ($e) => {
                            return doOption(
                                $e.token,
                                $d,
                                tuHandler,
                                () => dummyHandlers.requiredValue(),
                                (option, subHandler) => {
                                    return wrap(
                                        createValueUnmarshaller(
                                            option.value,
                                            subHandler,
                                            onError,
                                            flagNonDefaultPropertiesFound,
                                            mixedIn,
                                            dummyHandlers,
                                        ),
                                        () => {
                                            defaultInitializeValue(
                                                option.value,
                                                subHandler,
                                                //onError,
                                            )
                                        }
                                    )
                                }
                            )
                        },
                        missingOption: () => {
                            onError(["missing option", {}], $tu.token.annotation, ["error", {}])
                            defaultInitializeValue(
                                $d["default option"].get().value,
                                tuHandler.onOption({
                                    name: $d["default option"].name,
                                    token: null,
                                    definition: $d["default option"].get(),
                                }),
                                //onError,
                            )
                            return dummyHandlers.requiredValue()
                        },
                        end: ($) => {
                            tuHandler.onEnd({})
                        },
                    }
                },
                simpleString: ($e) => {
                    if (mixedIn !== null) {
                        if ($e.token.token.wrapping[0] === "apostrophe") {
                            const tuHandler = handler.onTaggedUnion({
                                definition: $d,
                                token: null,
                            })
                            return doOption(
                                $e.token,
                                $d,
                                tuHandler,
                                () => { },
                                (option, subHandler) => {
                                    mixedIn.pushTaggedUnion(
                                        option,
                                        tuHandler,
                                        subHandler
                                    )
                                }
                            )
                        } else {
                            defInitializeValue()
                            return createUnexpectedStringHandler(
                                ["expected a tagged union", {}],
                                $e.token.annotation,
                            )
                        }
                    } else {
                        defInitializeValue()
                        return createUnexpectedStringHandler(
                            ["expected a tagged union", {}],
                            $e.token.annotation,
                        )
                    }
                },
                multilineString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a tagged union", {}],
                        $e.token.annotation,
                    )
                },
            }
        }
        case "simple string": {
            const $d = definition.type[1]
            const error: api.UnmarshallError = $d.quoted
                ? ["expected an unquoted string", {}]
                : ["expected a quoted string", {}]
            return {
                array: ($e) => {
                    defInitializeValue()
                    return createUnexpectedArrayHandler(
                        error,
                        $e.token.annotation,
                    )
                },
                object: ($e) => {
                    defInitializeValue()
                    return createUnexpectedObjectHandler(
                        error,
                        $e.token.annotation,
                    )
                },
                taggedUnion: ($e) => {
                    defInitializeValue()
                    return createUnexpectedTaggedUnionHandler(
                        error,
                        $e.token.annotation,
                    )
                },
                multilineString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        error,
                        $e.token.annotation,
                    )
                },
                simpleString: ($e) => {
                    const value = $e.token.token.value
                    if (value !== $d["default value"]) {
                        flagNonDefaultPropertiesFound()
                    }
                    handler.onSimpleString({
                        value: $e.token.token.value,
                        token: {
                            token: $e.token.token,
                            annotation: $e.token.annotation,
                        },
                        definition: $d,
                        //  valueBuilder:   valueBuilder,
                        //     $e
                    })
                    switch ($e.token.token.wrapping[0]) {
                        case "none": {
                            if ($d.quoted) {
                                onError(["value should have quotes", {}], $e.token.annotation, ["warning", {}])
                            }
                            break
                        }
                        case "quote": {
                            if (!$d.quoted) {
                                onError(["value should not have quotes", {}], $e.token.annotation, ["warning", {}])
                            }
                            break
                        }
                        case "apostrophe": {
                            onError($d.quoted ? ["value should have quotes instead of apostrophes", {}] : ["value should not have apostrophes", {}], $e.token.annotation, ["warning", {}])
                            break
                        }
                        default:
                            pl.au($e.token.token.wrapping[0])
                    }
                },
            }
        }
        case "multiline string": {
            const $d = definition.type[1]

            return {
                array: ($e) => {
                    defInitializeValue()
                    return createUnexpectedArrayHandler(
                        ["expected a multiline string", {}],
                        $e.token.annotation,
                    )
                },
                object: ($e) => {
                    defInitializeValue()
                    return createUnexpectedObjectHandler(
                        ["expected a multiline string", {}],
                        $e.token.annotation,
                    )
                },
                taggedUnion: ($e) => {
                    defInitializeValue()
                    return createUnexpectedTaggedUnionHandler(
                        ["expected a multiline string", {}],
                        $e.token.annotation,
                    )
                },
                multilineString: ($e) => {
                    if ($e.token.token.lines.length > 1) {
                        flagNonDefaultPropertiesFound()
                    } else {
                        if ($e.token.token.lines.length === 1 && $e.token.token.lines[0] !== "") {
                            flagNonDefaultPropertiesFound()
                        }
                    }
                    handler.onMultilineString({
                        token: {
                            token: $e.token.token,
                            annotation: $e.token.annotation,
                        },
                        definition: $d,
                    })
                },
                simpleString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a multiline string", {}],
                        $e.token.annotation,
                    )
                },
            }
        }
        case "group": {
            const $d = definition.type[1]
            return {
                array: ($e) => {
                    if ($e.token.token.type[0] !== "shorthand group") {
                        if (mixedIn === null) {
                            onError(["expected a group", {}], $e.token.annotation, ["error", {}])
                            defInitializeValue()
                            return dummyHandlers.array()
                        } else {
                            return mixedIn.pushGroup($d, handler).array($e)
                        }
                    } else {
                        //start a shorthand group

                        const state = createShorthandParsingState(
                            $d,
                            handler.onGroup({
                                type: ["shorthand", {
                                    token: $e.token.token,
                                    annotation: $e.token.annotation,
                                }],
                                definition: $d,
                            }),
                        )

                        function createUnmarshallerForNextValue(): h.IValueHandler<Annotation> {
                            const nextValue = state.findNextValue()
                            if (nextValue === null) {
                                return {
                                    array: ($) => {
                                        onError(["superfluous element", {}], $.token.annotation, ["error", {}])
                                        return dummyHandlers.array()
                                    },
                                    object: ($) => {
                                        onError(["superfluous element", {}], $.token.annotation, ["error", {}])
                                        return dummyHandlers.object()
                                    },
                                    taggedUnion: ($) => {
                                        onError(["superfluous element", {}], $.token.annotation, ["error", {}])
                                        return dummyHandlers.taggedUnion()
                                    },
                                    simpleString: ($) => {
                                        onError(["superfluous element", {}], $.token.annotation, ["error", {}])
                                    },
                                    multilineString: ($) => {
                                        onError(["superfluous element", {}], $.token.annotation, ["error", {}])
                                    },
                                }
                            } else {

                                return createValueUnmarshaller(
                                    nextValue.definition,
                                    nextValue.handler,
                                    onError,
                                    flagNonDefaultPropertiesFound,
                                    {
                                        pushGroup: (definition, handler) => {
                                            state.pushGroup(definition, handler)
                                            return createUnmarshallerForNextValue()
                                        },
                                        pushTaggedUnion: (definition, taggedUnionHandler, optionHandler) => {
                                            state.pushTaggedUnion(definition, taggedUnionHandler, optionHandler)
                                        },
                                    },
                                    dummyHandlers,
                                )
                            }
                        }
                        return {
                            element: () => {
                                return createUnmarshallerForNextValue()
                            },
                            onEnd: ($e) => {
                                state.wrapup(
                                    $e.token.annotation,
                                    onError,
                                )
                            },
                        }
                    }
                },
                object: ($e) => {
                    if ($e.token.token.type[0] !== "verbose group") {
                        if (mixedIn === null) {
                            onError(["expected a group", {}], $e.token.annotation, ["error", {}])
                            defInitializeValue()
                            return dummyHandlers.object()
                        } else {
                            return mixedIn.pushGroup($d, handler).object($e)
                        }
                    } else {
                        //start a verbose group
                        const groupHandler = handler.onGroup({
                            type: ["verbose", {
                                annotation: $e.token.annotation,
                                token: $e.token.token,
                            }],
                            definition: $d,
                        })

                        const processedProperties: {
                            [key: string]: {
                                annotation: Annotation
                                isNonDefault: boolean
                            }
                        } = {}
                        return {
                            property: ($p) => {
                                const key = $p.token.token.value
                                if ($p.token.token.wrapping[0] !== "apostrophe") {
                                    onError(["property key does not have apostrophes", {}], $p.token.annotation, ["warning", {}])
                                }
                                return $d.properties.find(
                                    key,
                                    (propertyDefinition) => {
                                        const pp = {
                                            annotation: $p.token.annotation,
                                            isNonDefault: false,
                                        }
                                        processedProperties[key] = pp

                                        const propertyHandler = groupHandler.onProperty({
                                            key: $p.token.token.value,
                                            token: $p.token,
                                            definition: propertyDefinition.value,
                                        })
                                        return wrap(
                                            createValueUnmarshaller(
                                                propertyDefinition.value,
                                                propertyHandler,
                                                onError,
                                                () => {
                                                    pp.isNonDefault = true
                                                },
                                                null,
                                                dummyHandlers,
                                            ),
                                            () => {
                                                defaultInitializeValue(
                                                    propertyDefinition.value,
                                                    propertyHandler,
                                                    //onError,
                                                )
                                            }
                                        )
                                    },
                                    (keys) => {
                                        onError(["unknown property", { "known properties": keys }], $p.token.annotation, ["error", {}])
                                        groupHandler.onUnexpectedProperty({
                                            token: $p.token,
                                            groupDefinition: $d,
                                            expectedProperties: keys,
                                        })
                                        return dummyHandlers.requiredValue()
                                    }
                                )
                            },
                            anonymousProperty: () => {
                                return dummyHandlers.value()
                            },
                            onEnd: ($$) => {
                                let hadNonDefaultProperties = false

                                $d.properties.forEach(() => false, (propDefinition, key) => {
                                    const pp = processedProperties[key]
                                    if (pp === undefined) {
                                        defaultInitializeValue(
                                            propDefinition.value,
                                            groupHandler.onProperty({
                                                key: key,
                                                token: null,
                                                definition: propDefinition.value,
                                            }),
                                            //onError,
                                        )
                                    } else {
                                        if (!pp.isNonDefault) {
                                            onError(["property has default value, remove", {}], pp.annotation, ["warning", {}])
                                        } else {
                                            hadNonDefaultProperties = true
                                        }
                                    }
                                })
                                if (hadNonDefaultProperties) {
                                    flagNonDefaultPropertiesFound()
                                }
                                groupHandler.onClose({
                                    token: {
                                        token: {},
                                        annotation: $$.token.annotation,
                                    },
                                })
                            },
                        }
                    }
                },
                taggedUnion: ($e) => {
                    if (mixedIn === null) {
                        onError(["expected a group", {}], $e.token.annotation, ["error", {}])
                        defInitializeValue()
                        return dummyHandlers.taggedUnion()
                    } else {
                        return mixedIn.pushGroup($d, handler).taggedUnion($e)
                    }
                },
                simpleString: ($e) => {
                    if (mixedIn === null) {
                        onError(["expected a group", {}], $e.token.annotation, ["error", {}])
                        defInitializeValue()
                    } else {
                        return mixedIn.pushGroup($d, handler).simpleString($e)
                    }
                },
                multilineString: ($e) => {
                    if (mixedIn === null) {
                        onError(["expected a group", {}], $e.token.annotation, ["error", {}])
                        defInitializeValue()
                    } else {
                        mixedIn.pushGroup($d, handler).multilineString($e)
                    }
                },

            }
        }
        default:
            return pl.au(definition.type[0])
    }
}
