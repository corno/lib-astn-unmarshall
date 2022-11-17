/* eslint
    "@typescript-eslint/no-shadow": "off"
 */
import * as pl from "pareto-core-lib"

import * as tth from "api-astn-typedhandlers"
import * as h from "api-astn-handlers"

import * as api from "../../interface"

import { defaultInitializeValue } from "./defaultInitializeValue.p"
import { MixidIn } from "./internaltypes"

export function createValueUnmarshaller<PAnnotation>(
    $: {
        definition: tth.ValueDefinition,
        handler: tth.ITypedValueHandler<PAnnotation>,
    },
    onError: (type: api.TUnmarshallError, annotation: PAnnotation, severity: api.DiagnosticSeverity) => void,
    flagNonDefaultPropertiesFound: () => void,
    mixedIn: null | MixidIn<PAnnotation>,
): h.IValueHandler<PAnnotation> {


    type ValueContext<PAnnotation> = {
        definition: tth.ValueDefinition
        handler: tth.ITypedValueHandler<PAnnotation>
    }

    type IShorthandParsingState<PAnnotation> = {
        wrapup(
            annotation: PAnnotation,
            onError: (message: api.TUnmarshallError, annotation: PAnnotation, severity: api.DiagnosticSeverity) => void
        ): void
        findNextValue(): ValueContext<PAnnotation> | null
        pushGroup(
            definition: tth.GroupDefinition,
            handler: tth.ITypedValueHandler<PAnnotation>
        ): void
        pushTaggedUnion(
            definition: tth.OptionDefinition,
            taggedUnionHandler: tth.ITypedTaggedUnionHandler<PAnnotation>,
            optionHandler: tth.ITypedValueHandler<PAnnotation>,
        ): void
    }

    type OptionContext<PAnnotation> = {
        definition: tth.OptionDefinition
        optionHandler: tth.ITypedValueHandler<PAnnotation>
        taggedUnionHandler: tth.ITypedTaggedUnionHandler<PAnnotation>
    }

    type PropertyContext<PAnnotation> = {
        name: string
        definition: tth.ValueDefinition
        handler: tth.IGroupHandler<PAnnotation>
    }

    type ExpectedElements<PAnnotation> = PropertyContext<PAnnotation>[]

    type GroupContext<PAnnotation> = {
        isOuterGroup: boolean
        elements: ExpectedElements<PAnnotation>
        handler: tth.IGroupHandler<PAnnotation>
        index: number
    }

    function createGroupContext<PAnnotation>(
        definition: tth.GroupDefinition,
        isOuterGroup: boolean,
        subHandler: tth.IGroupHandler<PAnnotation>,
    ): Context<PAnnotation> {
        const expectedElements: ExpectedElements<PAnnotation> = []
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

    type Context<PAnnotation> =
        | ["group", GroupContext<PAnnotation>]
    //FIXME move option context here so tagged union onEnd can be called

    type StateImp<PAnnotation> = {
        stack: pc.Stack<Context<PAnnotation>>
        currentContext: Context<PAnnotation>
        optionContext: null | OptionContext<PAnnotation>
    }

    function createShorthandParsingState<PAnnotation>(
        groupDefinition: tth.GroupDefinition,
        groupHandler: tth.IGroupHandler<PAnnotation>,

    ): IShorthandParsingState<PAnnotation> {
        const stateImp: StateImp<PAnnotation> = {
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
                        type: ["mixin", null],
                        definition: definition,
                    }),
                )
            },
            wrapup: (annotation, onError) => {
                function wrapupImp(state: StateImp<PAnnotation>) {
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
                                    ["error", null],
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
                function findNextValueImp(): null | ValueContext<PAnnotation> {
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

    function wrap<PAnnotation>(
        handler: h.IValueHandler<PAnnotation>,
        onMissing: () => void,
    ): h.IRequiredValueHandler<PAnnotation> {
        return {
            exists: handler,
            missing: (): void => {
                onMissing()
            },
        }
    }

    function createUnexpectedArrayHandler(
        message: api.TUnmarshallError,
        annotation: PAnnotation,
    ): h.IArrayHandler<PAnnotation> {
        onError(message, annotation, ["error", null])
        return dummyHandlers.array()
    }

    function createUnexpectedObjectHandler(
        message: api.TUnmarshallError,
        annotation: PAnnotation,
    ): h.IObjectHandler<PAnnotation> {
        onError(message, annotation, ["error", null])
        return dummyHandlers.object()
    }

    function createUnexpectedTaggedUnionHandler(
        message: api.TUnmarshallError,
        annotation: PAnnotation,
    ): h.ITaggedUnionHandler<PAnnotation> {
        onError(message, annotation, ["error", null])
        return dummyHandlers.taggedUnion()
    }

    function createUnexpectedStringHandler(
        message: api.TUnmarshallError,
        annotation: PAnnotation,
    ): void {
        onError(message, annotation, ["error", null])
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
                        ["expected a dictionary", null],
                        $e.token.annotation,
                    )
                },
                object: ($e) => {
                    const foundKeysBuilder = pc.createArrayBuilder<string>()
                    if ($e.token.token.type[0] !== "dictionary") {
                        onError(["object is not a dictionary", null], $e.token.annotation, ["warning", null])
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
                                onError(["entry key does not have quotes", null], $p.token.annotation, ["warning", null])
                            }
                            foundKeysBuilder.toArray().forEach(($) => {
                                if ($ === $p.token.token.value) {
                                    onError(["duplicate key", null], $p.token.annotation, ["error", null])
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
                        ["expected a dictionary", null],
                        $e.token.annotation,
                    )
                },
                simpleString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a dictionary", null],
                        $e.token.annotation,
                    )
                },
                multilineString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a dictionary", null],
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
                        onError(["array is not a list", null], $e.token.annotation, ["error", null])
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
                        ["expected a list", null],
                        $e.token.annotation,
                    )
                },
                taggedUnion: ($e) => {
                    defInitializeValue()
                    return createUnexpectedTaggedUnionHandler(
                        ["expected a list", null],
                        $e.token.annotation,
                    )
                },
                simpleString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a list", null],
                        $e.token.annotation,
                    )
                },
                multilineString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a list", null],
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
            )
        }
        case "tagged union": {
            const $d = definition.type[1]
            function doOption<T>(
                optionToken: h.SimpleStringToken<PAnnotation>,
                definition: tth.TaggedUnionDefinition,
                tuHandler: tth.ITypedTaggedUnionHandler<PAnnotation>,
                unknownCallback: () => T,
                knownCallback: (option: tth.OptionDefinition, handler: tth.ITypedValueHandler<PAnnotation>) => T,
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
                            ["error", null]
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
                        ["expected a tagged union", null],
                        $e.token.annotation,
                        //onError,
                        //dummyHandlers,
                    )
                },
                object: ($e) => {
                    defInitializeValue()
                    return createUnexpectedObjectHandler(
                        ["expected a tagged union", null],
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
                            onError(["missing option", null], $tu.token.annotation, ["error", null])
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
                                ["expected a tagged union", null],
                                $e.token.annotation,
                            )
                        }
                    } else {
                        defInitializeValue()
                        return createUnexpectedStringHandler(
                            ["expected a tagged union", null],
                            $e.token.annotation,
                        )
                    }
                },
                multilineString: ($e) => {
                    defInitializeValue()
                    return createUnexpectedStringHandler(
                        ["expected a tagged union", null],
                        $e.token.annotation,
                    )
                },
            }
        }
        case "simple string": {
            const $d = definition.type[1]
            const error: api.TUnmarshallError = $d.quoted
                ? ["expected an unquoted string", null]
                : ["expected a quoted string", null]
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
                                onError(["value should have quotes", null], $e.token.annotation, ["warning", null])
                            }
                            break
                        }
                        case "quote": {
                            if (!$d.quoted) {
                                onError(["value should not have quotes", null], $e.token.annotation, ["warning", null])
                            }
                            break
                        }
                        case "apostrophe": {
                            onError($d.quoted ? ["value should have quotes instead of apostrophes", null] : ["value should not have apostrophes", null], $e.token.annotation, ["warning", null])
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
                        ["expected a multiline string", null],
                        $e.token.annotation,
                    )
                },
                object: ($e) => {
                    defInitializeValue()
                    return createUnexpectedObjectHandler(
                        ["expected a multiline string", null],
                        $e.token.annotation,
                    )
                },
                taggedUnion: ($e) => {
                    defInitializeValue()
                    return createUnexpectedTaggedUnionHandler(
                        ["expected a multiline string", null],
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
                        ["expected a multiline string", null],
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
                            onError(["expected a group", null], $e.token.annotation, ["error", null])
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

                        function createUnmarshallerForNextValue(): h.IValueHandler<PAnnotation> {
                            const nextValue = state.findNextValue()
                            if (nextValue === null) {
                                return {
                                    array: ($) => {
                                        onError(["superfluous element", null], $.token.annotation, ["error", null])
                                        return dummyHandlers.array()
                                    },
                                    object: ($) => {
                                        onError(["superfluous element", null], $.token.annotation, ["error", null])
                                        return dummyHandlers.object()
                                    },
                                    taggedUnion: ($) => {
                                        onError(["superfluous element", null], $.token.annotation, ["error", null])
                                        return dummyHandlers.taggedUnion()
                                    },
                                    simpleString: ($) => {
                                        onError(["superfluous element", null], $.token.annotation, ["error", null])
                                    },
                                    multilineString: ($) => {
                                        onError(["superfluous element", null], $.token.annotation, ["error", null])
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
                            onError(["expected a group", null], $e.token.annotation, ["error", null])
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
                                annotation: PAnnotation
                                isNonDefault: boolean
                            }
                        } = {}
                        return {
                            property: ($p) => {
                                const key = $p.token.token.value
                                if ($p.token.token.wrapping[0] !== "apostrophe") {
                                    onError(["property key does not have apostrophes", null], $p.token.annotation, ["warning", null])
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
                                        onError(["unknown property", { "known properties": keys }], $p.token.annotation, ["error", null])
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
                                            onError(["property has default value, remove", null], pp.annotation, ["warning", null])
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
                        onError(["expected a group", null], $e.token.annotation, ["error", null])
                        defInitializeValue()
                        return dummyHandlers.taggedUnion()
                    } else {
                        return mixedIn.pushGroup($d, handler).taggedUnion($e)
                    }
                },
                simpleString: ($e) => {
                    if (mixedIn === null) {
                        onError(["expected a group", null], $e.token.annotation, ["error", null])
                        defInitializeValue()
                    } else {
                        return mixedIn.pushGroup($d, handler).simpleString($e)
                    }
                },
                multilineString: ($e) => {
                    if (mixedIn === null) {
                        onError(["expected a group", null], $e.token.annotation, ["error", null])
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
