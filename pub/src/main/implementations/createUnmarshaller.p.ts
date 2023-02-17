import * as pl from 'pareto-core-lib'

import { $$ as defaultInitializeValue } from "./defaultInitializeValue.p"

import * as api from "../api"


import * as mth from "glo-astn-typedhandlers"
import * as mschema from "glo-astn-schema"
import * as mh from "glo-astn-handlers"


export const $$: api.CcreateUnmarshaller = ($, $i) => {

    type MixidIn<PAnnotation> = {
        readonly "pushGroup": (
             definition: mschema.T.group,
             groupContainerHandler: mth.IValueHandler<PAnnotation>
         ) => mh.IValueHandler<PAnnotation>
         pushTaggedUnion: (
             definition: mschema.T.options,
             taggedUnionHandler: mth.ITaggedUnionHandler<PAnnotation>,
             optionHandler: mth.IValueHandler<PAnnotation>,
         ) => void
     }
     
    function createValueUnmarshaller<PAnnotation>/*  */(
        $: {
            definition: mschema.T.value,
            mixedIn: null | MixidIn<PAnnotation>,
        },
        $i: {
            handler: mth.IValueHandler<PAnnotation>,
            onError: ($: api.T.UnmarshallError<PAnnotation>,) => void,
            flagNonDefaultPropertiesFound: () => void,
        },
    ): mh.IValueHandler<PAnnotation> {


        type ValueContext<PAnnotation> = {
            definition: mschema.T.value
            handler: mth.IValueHandler<PAnnotation>
        }

        type IShorthandParsingState<PAnnotation> = {
            wrapup(
                annotation: PAnnotation,
                onError: (message: api.T.UnmarshallError<PAnnotation>, annotation: PAnnotation, severity: api.T.DiagnosticSeverity<PAnnotation>) => void
            ): void
            findNextValue(): ValueContext<PAnnotation> | null
            pushGroup(
                definition: mschema.T.group,
                handler: mth.IValueHandler<PAnnotation>
            ): void
            pushTaggedUnion(
                definition: mschema.T.options,
                taggedUnionHandler: mth.ITaggedUnionHandler<PAnnotation>,
                optionHandler: mth.IValueHandler<PAnnotation>,
            ): void
        }

        type OptionContext<PAnnotation> = {
            definition: mschema.T.options
            optionHandler: mth.IValueHandler<PAnnotation>
            taggedUnionHandler: mth.ITaggedUnionHandler<PAnnotation>
        }

        type PropertyContext<PAnnotation> = {
            name: string
            definition: mschema.T.value
            handler: mth.IGroupHandler<PAnnotation>
        }

        type ExpectedElements<PAnnotation> = PropertyContext<PAnnotation>[]

        type GroupContext<PAnnotation> = {
            isOuterGroup: boolean
            elements: ExpectedElements<PAnnotation>
            handler: mth.IGroupHandler<PAnnotation>
            index: number
        }

        function createGroupContext<PAnnotation>(
            definition: mschema.T.group,
            isOuterGroup: boolean,
            subHandler: mth.IGroupHandler<PAnnotation>,
        ): Context<PAnnotation> {
            const expectedElements: ExpectedElements<PAnnotation> = []
            definition.properties.forEach(() => false, (propDefinition, key) => {
                expectedElements.push({
                    name: key,
                    handler: subHandler,
                    definition: propDefinition.value,
                })
            })
            return ['group', {
                elements: expectedElements,
                isOuterGroup: isOuterGroup,
                handler: subHandler,
                index: 0,
            }]
        }

        type Context<PAnnotation> =
            | ['group', GroupContext<PAnnotation>]
        //FIXME move option context here so tagged union onEnd can be called

        type StateImp<PAnnotation> = {
            stack: pc.Stack<Context<PAnnotation>>
            currentContext: Context<PAnnotation>
            optionContext: null | OptionContext<PAnnotation>
        }

        function createShorthandParsingState<PAnnotation>(
            groupDefinition: mschema.T.group,
            groupHandler: mth.IGroupHandler<PAnnotation>,

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
                            type: ['mixin', {}],
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
                            case 'group':
                                const $ = state.currentContext[1]
                                const missing = $.elements.length - $.index
                                if (missing > 0) {
                                    onError(
                                        ['missing elements', { elements: $.elements.slice($.index).map((ee) => ee.name) }],
                                        annotation,
                                        ['error', null],
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
                            case 'group':
                                const $ = stateImp.currentContext[1]
                                const ee = $.elements[$.index]
                                $.index++
                                if (ee !== undefined) {
                                    return {
                                        definition: ee.definition,
                                        handler: ee.handler.onProperty({
                                            token: [false],
                                            key: ee.name,
                                            definition: ee.definition,
                                        }),
                                    }
                                } else {
                                    //end of array of properties
                                    $.handler.onClose({
                                        token: [false],
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
            handler: mh.IValueHandler<PAnnotation>,
            onMissing: () => void,
        ): mh.IRequiredValueHandler<PAnnotation> {
            return {
                exists: handler,
                missing: (): void => {
                    onMissing()
                },
            }
        }

        function createUnexpectedArrayHandler(
            message: api.T.UnmarshallError._ltype<PAnnotation>,
            annotation: PAnnotation,
        ): mh.IArrayHandler<PAnnotation> {
            onError(message, annotation, ['error', {}])
            return dummyHandlers.array()
        }

        function createUnexpectedObjectHandler(
            message: api.T.UnmarshallError._ltype<PAnnotation>,
            annotation: PAnnotation,
        ): mh.IObjectHandler<PAnnotation> {
            onError(message, annotation, ['error', {}])
            return dummyHandlers.object()
        }

        function createUnexpectedTaggedUnionHandler(
            message: api.T.UnmarshallError._ltype<PAnnotation>,
            annotation: PAnnotation,
        ): mh.ITaggedUnionHandler<PAnnotation> {
            onError(message, annotation, ['error', {}])
            return dummyHandlers.taggedUnion()
        }

        function createUnexpectedStringHandler(
            message: api.T.UnmarshallError._ltype<PAnnotation>,
            annotation: PAnnotation,
        ): void {
            onError(message, annotation, ['error', {}])
        }

        function defInitializeValue() {
            defaultInitializeValue(
                $.definition,
                handler,
                //onError,
            )
        }

        switch ($.definition.type[0]) {
            case 'dictionary': {
                const $d = $.definition.type[1]
                return {
                    array: ($e) => {
                        defInitializeValue()
                        return createUnexpectedArrayHandler(
                            ['expected a dictionary', {}],
                            $e.annotation,
                        )
                    },
                    object: ($e) => {
                        const foundKeysBuilder = pc.createArrayBuilder<string>()
                        if ($e.token.type[0] !== 'dictionary') {
                            onError(['object is not a dictionary', {}], $e.annotation, ['warning', {}])
                        }

                        const dictHandler = handler.onDictionary({
                            token: {
                                token: $e.token,
                                annotation: $e.annotation,
                            },
                            definition: $d,
                        })
                        return {
                            property: ($p) => {
                                if ($p.token.wrapping[0] !== 'quote') {
                                    onError(['entry key does not have quotes', {}], $p.annotation, ['warning', {}])
                                }
                                foundKeysBuilder.toArray().forEach(($) => {
                                    if ($ === $p.token.value) {
                                        onError(['duplicate key', {}], $p.annotation, ['error', {}])
                                    }
                                })
                                foundKeysBuilder.push($p.token.value)
                                flagNonDefaultPropertiesFound()

                                const entryHandler = dictHandler.onEntry({
                                    token: {
                                        token: $p.token,
                                        annotation: $p.annotation,
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
                                        annotation: $ee.annotation,
                                    },
                                })

                            },
                        }
                    },
                    taggedUnion: ($e) => {
                        defInitializeValue()
                        return createUnexpectedTaggedUnionHandler(
                            ['expected a dictionary', {}],
                            $e.annotation,
                        )
                    },
                    simpleString: ($e) => {
                        defInitializeValue()
                        return createUnexpectedStringHandler(
                            ['expected a dictionary', {}],
                            $e.annotation,
                        )
                    },
                    multilineString: ($e) => {
                        defInitializeValue()
                        return createUnexpectedStringHandler(
                            ['expected a dictionary', {}],
                            $e.annotation,
                        )
                    },
                }

            }
            case 'list': {
                return pl.cc($.definition.type[1], ($) => {
                    const definition = $
                    return {
                        array: ($) => {
                            if ($.token.type[0] !== 'list') {
                                onError(['array is not a list', {}], $.annotation, ['error', {}])
                            }
                            const listHandler = handler.onList({
                                token: {
                                    token: $.token,
                                    annotation: $.annotation,
                                },
                                definition: $,
                            })
                            return {
                                element: ($) => {
                                    flagNonDefaultPropertiesFound()
                                    // const entry = collBuilder.createEntry(_errorMessage => {
                                    //     //onError(errorMessage, svData)
                                    // })
                                    const elementSideEffects = listHandler.onElement({})
                                    return createValueUnmarshaller(
                                        $.value,
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
                                            annotation: $.annotation,
                                        },
                                    })
                                },
                            }
                        },
                        object: ($e) => {
                            defInitializeValue()
                            return createUnexpectedObjectHandler(
                                ['expected a list', {}],
                                $e.annotation,
                            )
                        },
                        taggedUnion: ($e) => {
                            defInitializeValue()
                            return createUnexpectedTaggedUnionHandler(
                                ['expected a list', {}],
                                $e.annotation,
                            )
                        },
                        simpleString: ($e) => {
                            defInitializeValue()
                            return createUnexpectedStringHandler(
                                ['expected a list', {}],
                                $e.annotation,
                            )
                        },
                        multilineString: ($e) => {
                            defInitializeValue()
                            return createUnexpectedStringHandler(
                                ['expected a list', {}],
                                $e.annotation,
                            )
                        },
                    }

                })
            }
            case 'type reference': {
                return pl.cc($.$.definition.type[1], ($) => {

                    return createValueUnmarshaller(
                        $.type.x().value,
                        handler.onTypeReference({
                            definition: $e,
                        }),
                        onError,
                        flagNonDefaultPropertiesFound,
                        mixedIn,
                    )
                })
            }
            case 'tagged union': {
                const $d = $.definition.type[1]
                function doOption<T>(
                    optionToken: mh.SimpleStringToken<PAnnotation>,
                    definition: mth.TaggedUnionDefinition,
                    tuHandler: mth.ITypedTaggedUnionHandler<PAnnotation>,
                    unknownCallback: () => T,
                    knownCallback: (option: mth.OptionDefinition, handler: mth.IValueHandler<PAnnotation>) => T,
                ): T {
                    return definition.options.find(
                        optionToken.token.value,
                        (optionDefinition) => {
                            if (optionDefinition !== definition['default option'].get()) {
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
                                ['unknown option', {
                                    'known options': keys,
                                }],
                                optionToken.annotation,
                                ['error', {}]
                            )
                            defaultInitializeValue(
                                definition['default option'].get().value,
                                tuHandler.onUnexpectedOption({
                                    defaultOption: definition['default option'].name,
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
                            ['expected a tagged union', {}],
                            $e.annotation,
                            //onError,
                            //dummyHandlers,
                        )
                    },
                    object: ($e) => {
                        defInitializeValue()
                        return createUnexpectedObjectHandler(
                            ['expected a tagged union', {}],
                            $e.annotation,
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
                                onError(['missing option', {}], $tu.annotation, ['error', {}])
                                defaultInitializeValue(
                                    $d['default option'].get().value,
                                    tuHandler.onOption({
                                        name: $d['default option'].name,
                                        token: null,
                                        definition: $d['default option'].get(),
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
                            if ($e.token.wrapping[0] === 'apostrophe') {
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
                                    ['expected a tagged union', {}],
                                    $e.annotation,
                                )
                            }
                        } else {
                            defInitializeValue()
                            return createUnexpectedStringHandler(
                                ['expected a tagged union', {}],
                                $e.annotation,
                            )
                        }
                    },
                    multilineString: ($e) => {
                        defInitializeValue()
                        return createUnexpectedStringHandler(
                            ['expected a tagged union', {}],
                            $e.annotation,
                        )
                    },
                }
            }
            case 'simple string': {
                const $d = $.definition.type[1]
                const error: api.T.UnmarshallError<PAnnotation> = $d.quoted
                    ? ['expected an unquoted string', null]
                    : ['expected a quoted string', null]
                return {
                    array: ($e) => {
                        defInitializeValue()
                        return createUnexpectedArrayHandler(
                            error,
                            $e.annotation,
                        )
                    },
                    object: ($e) => {
                        defInitializeValue()
                        return createUnexpectedObjectHandler(
                            error,
                            $e.annotation,
                        )
                    },
                    taggedUnion: ($e) => {
                        defInitializeValue()
                        return createUnexpectedTaggedUnionHandler(
                            error,
                            $e.annotation,
                        )
                    },
                    multilineString: ($e) => {
                        defInitializeValue()
                        return createUnexpectedStringHandler(
                            error,
                            $e.annotation,
                        )
                    },
                    simpleString: ($e) => {
                        const value = $e.token.value
                        if (value !== $d['default value']) {
                            flagNonDefaultPropertiesFound()
                        }
                        handler.onSimpleString({
                            value: $e.token.value,
                            token: {
                                token: $e.token,
                                annotation: $e.annotation,
                            },
                            definition: $d,
                            //  valueBuilder:   valueBuilder,
                            //     $e
                        })
                        switch ($e.token.wrapping[0]) {
                            case 'none': {
                                if ($d.quoted) {
                                    onError(['value should have quotes', {}], $e.annotation, ['warning', {}])
                                }
                                break
                            }
                            case 'quote': {
                                if (!$d.quoted) {
                                    onError(['value should not have quotes', {}], $e.annotation, ['warning', {}])
                                }
                                break
                            }
                            case 'apostrophe': {
                                onError($d.quoted ? ['value should have quotes instead of apostrophes', null] : ['value should not have apostrophes', null], $e.annotation, ['warning', null])
                                break
                            }
                            default:
                                pl.au($e.token.wrapping[0])
                        }
                    },
                }
            }
            case 'multiline string': {
                const $d = $.definition.type[1]

                return {
                    array: ($e) => {
                        defInitializeValue()
                        return createUnexpectedArrayHandler(
                            ['expected a multiline string', {}],
                            $e.annotation,
                        )
                    },
                    object: ($e) => {
                        defInitializeValue()
                        return createUnexpectedObjectHandler(
                            ['expected a multiline string', {}],
                            $e.annotation,
                        )
                    },
                    taggedUnion: ($e) => {
                        defInitializeValue()
                        return createUnexpectedTaggedUnionHandler(
                            ['expected a multiline string', {}],
                            $e.annotation,
                        )
                    },
                    multilineString: ($e) => {
                        if ($e.token.lines.length > 1) {
                            flagNonDefaultPropertiesFound()
                        } else {
                            if ($e.token.lines.length === 1 && $e.token.lines[0] !== "") {
                                flagNonDefaultPropertiesFound()
                            }
                        }
                        handler.onMultilineString({
                            token: {
                                token: $e.token,
                                annotation: $e.annotation,
                            },
                            definition: $d,
                        })
                    },
                    simpleString: ($e) => {
                        defInitializeValue()
                        return createUnexpectedStringHandler(
                            ['expected a multiline string', {}],
                            $e.annotation,
                        )
                    },
                }
            }
            case 'group': {
                return pl.cc($.definition.type[1], ($) => {
                    const group = $
                    return {
                        array: ($e) => {
                            if ($e.token.type[0] !== 'shorthand group') {
                                if (mixedIn === null) {
                                    onError(['expected a group', {}], $e.annotation, ['error', {}])
                                    defInitializeValue()
                                    return dummyHandlers.array()
                                } else {
                                    return mixedIn.pushGroup(group, handler).array($e)
                                }
                            } else {
                                //start a shorthand group

                                const state = createShorthandParsingState(
                                    group,
                                    handler.onGroup({
                                        type: ['shorthand', {
                                            token: $e.token,
                                            annotation: $e.annotation,
                                        }],
                                        definition: group,
                                    }),
                                )

                                function createUnmarshallerForNextValue(): mh.IValueHandler<PAnnotation> {
                                    const nextValue = state.findNextValue()
                                    if (nextValue === null) {
                                        return {
                                            array: ($) => {
                                                onError(['superfluous element', {}], $.annotation, ['error', {}])
                                                return dummyHandlers.array()
                                            },
                                            object: ($) => {
                                                onError(['superfluous element', {}], $.annotation, ['error', {}])
                                                return dummyHandlers.object()
                                            },
                                            taggedUnion: ($) => {
                                                onError(['superfluous element', {}], $.annotation, ['error', {}])
                                                return dummyHandlers.taggedUnion()
                                            },
                                            simpleString: ($) => {
                                                onError(['superfluous element', {}], $.annotation, ['error', {}])
                                            },
                                            multilineString: ($) => {
                                                onError(['superfluous element', {}], $.annotation, ['error', {}])
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
                                            $e.annotation,
                                            onError,
                                        )
                                    },
                                }
                            }
                        },
                        object: ($e) => {
                            if ($e.token.type[0] !== 'verbose group') {
                                if (mixedIn === null) {
                                    onError(['expected a group', {}], $e.annotation, ['error', {}])
                                    defInitializeValue()
                                    return dummyHandlers.object()
                                } else {
                                    return mixedIn.pushGroup(group, handler).object($e)
                                }
                            } else {
                                //start a verbose group
                                const groupHandler = handler.onGroup({
                                    type: ['verbose', {
                                        annotation: $e.annotation,
                                        token: $e.token,
                                    }],
                                    definition: group,
                                })

                                const processedProperties: {
                                    [key: string]: {
                                        annotation: PAnnotation
                                        isNonDefault: boolean
                                    }
                                } = {}
                                return {
                                    property: ($p) => {
                                        const key = $p.token.value
                                        if ($p.token.wrapping[0] !== 'apostrophe') {
                                            onError(['property key does not have apostrophes', null], $p.annotation, ['warning', null])
                                        }
                                        return group.properties.find(
                                            key,
                                            (propertyDefinition) => {
                                                const pp = {
                                                    annotation: $p.annotation,
                                                    isNonDefault: false,
                                                }
                                                processedProperties[key] = pp

                                                const propertyHandler = groupHandler.onProperty({
                                                    key: $p.token.value,
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
                                                onError(['unknown property', { 'known properties': keys }], $p.annotation, ['error', null])
                                                groupHandler.onUnexpectedProperty({
                                                    token: $p.token,
                                                    groupDefinition: group,
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

                                        group.properties.forEach(() => false, (propDefinition, key) => {
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
                                                    onError(['property has default value, remove', null], pp.annotation, ['warning', null])
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
                                                annotation: $$.annotation,
                                            },
                                        })
                                    },
                                }
                            }
                        },
                        taggedUnion: ($e) => {
                            if (mixedIn === null) {
                                onError(['expected a group', {}], $e.annotation, ['error', {}])
                                defInitializeValue()
                                return dummyHandlers.taggedUnion()
                            } else {
                                return mixedIn.pushGroup(group, handler).taggedUnion($e)
                            }
                        },
                        simpleString: ($e) => {
                            if (mixedIn === null) {
                                onError(['expected a group', {}], $e.annotation, ['error', {}])
                                defInitializeValue()
                            } else {
                                return mixedIn.pushGroup(group, handler).simpleString($e)
                            }
                        },
                        multilineString: ($e) => {
                            if (mixedIn === null) {
                                onError(['expected a group', {}], $e.annotation, ['error', {}])
                                defInitializeValue()
                            } else {
                                mixedIn.pushGroup(group, handler).multilineString($e)
                            }
                        },

                    }

                })
            }
            default:
                return pl.au($.definition.type[0])
        }
    }

    return {
        exists: createValueUnmarshaller(
            {
                'definition': $.schema["root type"].referencee().value,
                'mixedIn': null,
            },
            {
                'handler': $i.handler,
                'onError': $i.onError,
                'flagNonDefaultPropertiesFound': () => { },
            }
        ),
        missing: () => {
            defaultInitializeValue(
                $.schema["root type"].referencee().value,
                $i.handler,
            )
        },
    }
}
