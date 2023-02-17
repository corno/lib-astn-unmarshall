import * as pl from 'pareto-core-lib'
import * as ps from 'pareto-core-state'

import { $$ as defaultInitializeValue } from "./defaultInitializeValue.p"

import * as api from "../api"


import * as mth from "glo-astn-typedhandlers"
import * as mschema from "glo-astn-schema"
import * as mh from "glo-astn-handlers"


export const $$: api.CcreateUnmarshaller = ($d) => {

    return <PAnnotation>($: api.T.CreateUnmarshallerData<PAnnotation>, $i: api.IUnmarshallHandler<PAnnotation>) => {
        const onError = $i.onError


        function createDummyObjectHandler(): mh.IObjectHandler<PAnnotation> {
            return {
                property: () => {
                    return createDummyRequiredValueHandler()
                },
                anonymousProperty: () => {
                    return createDummyValueHandler()
                },
                onEnd: () => { },
            }
        }
        function createDummyArrayHandler(): mh.IArrayHandler<PAnnotation> {
            return {
                element: () => {
                    return createDummyValueHandler()
                },
                onEnd: () => { }
            }
        }
        function createDummyTaggedUnionHandler(): mh.ITaggedUnionHandler<PAnnotation> {
            return {
                option: () => createDummyRequiredValueHandler(),
                missingOption: () => createDummyRequiredValueHandler(),
                onEnd: () => { }
            }
        }
        function createDummyValueHandler(): mh.IValueHandler<PAnnotation> {

            return {
                object: () => {
                    return createDummyObjectHandler()
                },
                array: () => {
                    return createDummyArrayHandler()
                },
                taggedUnion: () => {
                    return createDummyTaggedUnionHandler()
                },
                simpleString: () => {
                },
                multilineString: () => {

                }
            }
        }

        function createDummyRequiredValueHandler(): mh.IRequiredValueHandler<PAnnotation> {
            return {
                'missing': () => {
                },
                'exists': createDummyValueHandler()
            }

        }
        type MixidIn = {
            readonly 'pushGroup': (
                definition: mschema.T.group,
                groupContainerHandler: mth.IValueHandler<PAnnotation>
            ) => mh.IValueHandler<PAnnotation>
            'pushTaggedUnion': (
                definition: mschema.T.options,
                taggedUnionHandler: mth.ITaggedUnionHandler<PAnnotation>,
                optionHandler: mth.IValueHandler<PAnnotation>,
            ) => void
        }

        function createValueUnmarshaller(
            $: mschema.T.value,
            $i: {
                'handler': mth.IValueHandler<PAnnotation>,
                'flagNonDefaultPropertiesFound': () => void,
            },
            mixedIn: null | MixidIn,
        ): mh.IValueHandler<PAnnotation> {

            type ValueContext = {
                'definition': mschema.T.value
                'handler': mth.IValueHandler<PAnnotation>
            }

            function createGroupContext(
                definition: mschema.T.group,
                isOuterGroup: boolean,
                subHandler: mth.IGroupHandler<PAnnotation>,
            ): Context {
                const expectedElements = ps.createStack(definition.properties)
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

            type Context =
                | ['group', {
                    'isOuterGroup': boolean
                    'elements': {
                        'name': string
                        'definition': mschema.T.value
                        'handler': mth.IGroupHandler<PAnnotation>
                    }[]
                    'handler': mth.IGroupHandler<PAnnotation>
                    'index': number
                }]
            //FIXME move option context here so tagged union onEnd can be called

            type StateImp = {
                'stack': ps.Stack<Context>
                'currentContext': Context
                'optionContext': null | {
                    'definition': mschema.T.options
                    'optionHandler': mth.IValueHandler<PAnnotation>
                    'taggedUnionHandler': mth.ITaggedUnionHandler<PAnnotation>
                }
            }

            function createRequiredValueHandler(
                handler: mh.IValueHandler<PAnnotation>,
                onMissing: () => void,
            ): mh.IRequiredValueHandler<PAnnotation> {
                return {
                    exists: handler,
                    missing: onMissing,
                }
            }

            function createUnexpectedArrayHandler(
                message: api.T.UnmarshallError._ltype<PAnnotation>,
                annotation: PAnnotation,
            ): mh.IArrayHandler<PAnnotation> {
                onError({
                    'type': message,
                    'annotation': annotation,
                    'severity': ['error', {}],
                })
                return createDummyArrayHandler()
            }

            function createUnexpectedObjectHandler(
                message: api.T.UnmarshallError._ltype<PAnnotation>,
                annotation: PAnnotation,
            ): mh.IObjectHandler<PAnnotation> {
                onError({
                    'type': message,
                    'annotation': annotation,
                    'severity': ['error', {}],
                })
                return createDummyObjectHandler()
            }

            function createUnexpectedTaggedUnionHandler(
                message: api.T.UnmarshallError._ltype<PAnnotation>,
                annotation: PAnnotation,
            ): mh.ITaggedUnionHandler<PAnnotation> {
                onError({
                    'type': message,
                    'annotation': annotation,
                    'severity': ['error', {}],
                })
                return createDummyTaggedUnionHandler()
            }

            function createUnexpectedStringHandler(
                message: api.T.UnmarshallError._ltype<PAnnotation>,
                annotation: PAnnotation,
            ): void {
                onError({
                    'type': message,
                    'annotation': annotation,
                    'severity': ['error', {}],
                })
            }

            function defInitializeValue() {
                defaultInitializeValue(
                    $,
                    $i.handler,
                )
            }

            switch ($.type[0]) {
                case 'dictionary': {
                    return pl.cc($.type[1], ($) => {
                        const definition = $
                        return {
                            'array': ($) => {
                                defInitializeValue()
                                return createUnexpectedArrayHandler(
                                    ['expected a dictionary', {}],
                                    $.annotation,
                                )
                            },
                            'object': ($) => {
                                const foundKeysBuilder = pc.createArrayBuilder<string>()
                                if ($.token.type[0] !== 'dictionary') {
                                    onError({
                                        'annotation': $.annotation,
                                        'severity': ['warning', {}],
                                        'type': ['object is not a dictionary', {}],
                                    })
                                }

                                const dictHandler = $i.handler.onDictionary({
                                    token: [true, {
                                        token: $.token,
                                        annotation: $.annotation,
                                    }],
                                    definition: definition,
                                })
                                return {
                                    property: ($) => {
                                        const prop = $
                                        if ($.token.wrapping[0] !== 'quote') {
                                            onError({
                                                'annotation': $.annotation,
                                                'severity': ['warning', {}],
                                                'type': ['entry key does not have quotes', {}],
                                            })
                                        }
                                        foundKeysBuilder.toArray().forEach(($) => {
                                            if ($ === prop.token.value) {
                                                onError({
                                                    'annotation': prop.annotation,
                                                    'severity': ['error', {}],
                                                    'type': ['duplicate key', {}],
                                                })
                                            }
                                        })
                                        foundKeysBuilder.push($.token.value)
                                        $i.flagNonDefaultPropertiesFound()

                                        const entryHandler = dictHandler.onEntry({
                                            token: [true, {
                                                token: $.token,
                                                annotation: $.annotation,
                                            }],
                                        })
                                        return createRequiredValueHandler(
                                            createValueUnmarshaller(
                                                definition.value,
                                                {
                                                    'handler': entryHandler,
                                                    'flagNonDefaultPropertiesFound': () => { },
                                                },
                                                null,
                                            ),
                                            () => {
                                                defaultInitializeValue(
                                                    definition.value,
                                                    entryHandler,
                                                )
                                            }
                                        )
                                    },
                                    anonymousProperty: () => {
                                        return createDummyValueHandler()
                                    },
                                    onEnd: ($ee) => {
                                        dictHandler.onClose({
                                            token: [true, {
                                                token: {},
                                                annotation: $ee.annotation,
                                            }],
                                        })

                                    },
                                }
                            },
                            'taggedUnion': ($) => {
                                defInitializeValue()
                                return createUnexpectedTaggedUnionHandler(
                                    ['expected a dictionary', {}],
                                    $.annotation,
                                )
                            },
                            'simpleString': ($) => {
                                defInitializeValue()
                                return createUnexpectedStringHandler(
                                    ['expected a dictionary', {}],
                                    $.annotation,
                                )
                            },
                            'multilineString': ($) => {
                                defInitializeValue()
                                return createUnexpectedStringHandler(
                                    ['expected a dictionary', {}],
                                    $.annotation,
                                )
                            },
                        }

                    })
                }
                case 'list': {
                    return pl.cc($.type[1], ($) => {
                        const definition = $
                        return {
                            'array': ($) => {
                                if ($.token.type[0] !== 'list') {
                                    onError({
                                        'annotation': $.annotation,
                                        'severity': ['error', {}],
                                        'type': ['array is not a list', {}],
                                    })
                                }
                                const listHandler = $i.handler.onList({
                                    token: [true, {
                                        token: $.token,
                                        annotation: $.annotation,
                                    }],
                                    definition: definition,
                                })
                                return {
                                    element: ($) => {
                                        $i.flagNonDefaultPropertiesFound()
                                        const elementSideEffects = listHandler.onElement()
                                        return createValueUnmarshaller(
                                            definition.value,
                                            {
                                                'flagNonDefaultPropertiesFound': () => { },
                                                'handler': elementSideEffects,
                                            },
                                            null,
                                        )
                                    },
                                    onEnd: ($) => {
                                        listHandler.onClose({
                                            token: [true, {
                                                token: {},
                                                annotation: $.annotation,
                                            }],
                                        })
                                    },
                                }
                            },
                            'object': ($) => {
                                defInitializeValue()
                                return createUnexpectedObjectHandler(
                                    ['expected a list', {}],
                                    $.annotation,
                                )
                            },
                            'taggedUnion': ($) => {
                                defInitializeValue()
                                return createUnexpectedTaggedUnionHandler(
                                    ['expected a list', {}],
                                    $.annotation,
                                )
                            },
                            'simpleString': ($) => {
                                defInitializeValue()
                                return createUnexpectedStringHandler(
                                    ['expected a list', {}],
                                    $.annotation,
                                )
                            },
                            'multilineString': ($) => {
                                defInitializeValue()
                                return createUnexpectedStringHandler(
                                    ['expected a list', {}],
                                    $.annotation,
                                )
                            },
                        }

                    })
                }
                case 'type reference': {
                    return pl.cc($.type[1], ($) => {
                        const definition = $
                        return createValueUnmarshaller(
                            definition.type.referencee().value,
                            {
                                'flagNonDefaultPropertiesFound': $i.flagNonDefaultPropertiesFound,
                                'handler': $i.handler.onTypeReference({
                                    definition: $,
                                }),
                            },
                            mixedIn,
                        )
                    })
                }
                case 'tagged union': {
                    return pl.cc($.type[1], ($) => {
                        const definition = $
                        function doOption<T>(
                            optionToken: mh.T.SimpleStringToken<PAnnotation>,
                            definition: mschema.T.tagged__union,
                            tuHandler: mth.ITaggedUnionHandler<PAnnotation>,
                            unknownCallback: () => T,
                            knownCallback: (option: mschema.T.options, handler: mth.IValueHandler<PAnnotation>) => T,
                        ): T {
                            return definition.options.find(
                                optionToken.token.value,
                                (optionDefinition) => {
                                    if (optionDefinition !== definition['default option'].referencee()) {
                                        $i.flagNonDefaultPropertiesFound()
                                    }
                                    return knownCallback(
                                        optionDefinition,
                                        tuHandler.onOption({
                                            definition: optionDefinition,
                                            name: optionToken.token.value,
                                            token: [true, optionToken],
                                        })
                                    )
                                },
                                (keys) => {
                                    'onError'({
                                        'annotation': optionToken.annotation,
                                        'severity': ['error', {}],
                                        'type': ['unknown option', {
                                            'known options': keys,
                                        }],
                                    })
                                    'defaultInitializeValue'(
                                        definition['default option'].referencee().value,
                                        tuHandler.onUnexpectedOption({
                                            defaultOption: definition['default option'].name,
                                            expectedOptions: keys,
                                            token: [true, optionToken],
                                        }),
                                    )
                                    return unknownCallback()
                                },
                            )
                        }
                        return {
                            'array': ($) => {
                                defInitializeValue()
                                return createUnexpectedArrayHandler(
                                    ['expected a tagged union', {}],
                                    $.annotation,
                                )
                            },
                            'object': ($) => {
                                defInitializeValue()
                                return createUnexpectedObjectHandler(
                                    ['expected a tagged union', {}],
                                    $.annotation,
                                )
                            },
                            'taggedUnion': ($) => {
                                const tuHandler = $i.handler.onTaggedUnion({
                                    definition: definition,
                                    token: [true, $],
                                })
                                return {
                                    'option': ($) => {
                                        return doOption(
                                            $,
                                            definition,
                                            tuHandler,
                                            () => createDummyRequiredValueHandler(),
                                            (option, subHandler) => {
                                                return createRequiredValueHandler(
                                                    createValueUnmarshaller(
                                                        option.value,
                                                        {
                                                            'flagNonDefaultPropertiesFound': $i.flagNonDefaultPropertiesFound,
                                                            'handler': subHandler,
                                                        },
                                                        mixedIn,
                                                    ),
                                                    () => {
                                                        defaultInitializeValue(
                                                            option.value,
                                                            subHandler,
                                                        )
                                                    }
                                                )
                                            }
                                        )
                                    },
                                    'missingOption': ($) => {
                                        'onError'({
                                            'annotation': $,
                                            'severity': ['error', {}],
                                            'type': ['missing option', {}],
                                        })
                                        'defaultInitializeValue'(
                                            definition['default option'].referencee().value,
                                            tuHandler.onOption({
                                                name: definition['default option'].name,
                                                token: [false],
                                                definition: definition['default option'].referencee(),
                                            }),
                                        )
                                        return createDummyRequiredValueHandler()
                                    },
                                    'onEnd': () => {
                                        tuHandler.onEnd()
                                    },
                                }
                            },
                            'simpleString': ($) => {
                                if (mixedIn !== null) {
                                    if ($.token.wrapping[0] === 'apostrophe') {
                                        const tuHandler = $i.handler.onTaggedUnion({
                                            definition: definition,
                                            token: [false],
                                        })
                                        return doOption(
                                            $,
                                            definition,
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
                                            $.annotation,
                                        )
                                    }
                                } else {
                                    defInitializeValue()
                                    return createUnexpectedStringHandler(
                                        ['expected a tagged union', {}],
                                        $.annotation,
                                    )
                                }
                            },
                            'multilineString': ($) => {
                                defInitializeValue()
                                return createUnexpectedStringHandler(
                                    ['expected a tagged union', {}],
                                    $.annotation,
                                )
                            },
                        }
                    })
                }
                case 'simple string': {
                    return pl.cc($.type[1], ($) => {
                        const definition = $
                        const error: api.T.UnmarshallError._ltype<PAnnotation> = definition.quoted
                            ? ['expected an unquoted string', {}]
                            : ['expected a quoted string', {}]
                        return {
                            'array': ($) => {
                                defInitializeValue()
                                return createUnexpectedArrayHandler(
                                    error,
                                    $.annotation,
                                )
                            },
                            'object': ($) => {
                                defInitializeValue()
                                return createUnexpectedObjectHandler(
                                    error,
                                    $.annotation,
                                )
                            },
                            'taggedUnion': ($) => {
                                defInitializeValue()
                                return createUnexpectedTaggedUnionHandler(
                                    error,
                                    $.annotation,
                                )
                            },
                            'multilineString': ($) => {
                                defInitializeValue()
                                return createUnexpectedStringHandler(
                                    error,
                                    $.annotation,
                                )
                            },
                            'simpleString': ($) => {
                                const ssAnnotation = $.annotation
                                if (!$d.stringsAreEqual([$.token.value, definition['default value']])) {
                                    $i.flagNonDefaultPropertiesFound()
                                }
                                switch ($.token.wrapping[0]) {
                                    case 'none': {
                                        pl.cc($.token.wrapping[1], ($) => {
                                            if (definition.quoted) {
                                                onError({
                                                    'annotation': ssAnnotation,
                                                    'severity': ['warning', {}],
                                                    'type': ['value should have quotes', {}],
                                                })
                                            }
                                        })
                                        break
                                    }
                                    case 'quote': {
                                        pl.cc($.token.wrapping[1], ($) => {
                                            if (!definition.quoted) {
                                                onError({
                                                    'annotation': ssAnnotation,
                                                    'severity': ['warning', {}],
                                                    'type': ['value should not have quotes', {}],
                                                })
                                            }
                                        })
                                        break
                                    }
                                    case 'apostrophe': {
                                        pl.cc($.token.wrapping[1], ($) => {
                                            onError({
                                                'annotation': ssAnnotation,
                                                'severity': ['warning', {}],
                                                'type': definition.quoted
                                                    ? ['value should have quotes instead of apostrophes', {}]
                                                    : ['value should not have apostrophes', {}]
                                                ,
                                            })
                                        })
                                        break
                                    }
                                    default:
                                        pl.au($.token.wrapping[0])
                                }
                                $i.handler.onSimpleString({
                                    value: $.token.value,
                                    token: [true, {
                                        token: $.token,
                                        annotation: $.annotation,
                                    }],
                                    definition: definition,
                                    //  valueBuilder:   valueBuilder,
                                })
                            },
                        }
                    })
                }
                case 'multiline string': {
                    return pl.cc($.type[1], ($) => {
                        const definition = $

                        return {
                            'array': ($) => {
                                defInitializeValue()
                                return createUnexpectedArrayHandler(
                                    ['expected a multiline string', {}],
                                    $.annotation,
                                )
                            },
                            'object': ($) => {
                                defInitializeValue()
                                return createUnexpectedObjectHandler(
                                    ['expected a multiline string', {}],
                                    $.annotation,
                                )
                            },
                            'taggedUnion': ($) => {
                                defInitializeValue()
                                return createUnexpectedTaggedUnionHandler(
                                    ['expected a multiline string', {}],
                                    $.annotation,
                                )
                            },
                            'multilineString': ($) => {
                                if (!$d.multilineStringIsEmpty($.token)) {
                                    $i.flagNonDefaultPropertiesFound()
                                }
                                // if ($.token.lines.length > 1) {
                                //     $i.flagNonDefaultPropertiesFound()
                                // } else {
                                //     if ($.token.lines.length === 1 && $.token.lines[0] !== "") {
                                //         $i.flagNonDefaultPropertiesFound()
                                //     }
                                // }
                                $i.handler.onMultilineString({
                                    token: [true, {
                                        token: $.token,
                                        annotation: $.annotation,
                                    }],
                                    definition: definition,
                                })
                            },
                            'simpleString': ($) => {
                                defInitializeValue()
                                return createUnexpectedStringHandler(
                                    ['expected a multiline string', {}],
                                    $.annotation,
                                )
                            },
                        }
                    })
                }
                case 'group': {
                    return pl.cc($.type[1], ($) => {
                        const definition = $
                        return {
                            'array': ($) => {
                                if ($.token.type[0] !== 'shorthand group') {
                                    if (mixedIn === null) {
                                        onError({
                                            'annotation': $.annotation,
                                            'severity': ['error', {}],
                                            'type': ['expected a group', {}],
                                        })
                                        defInitializeValue()
                                        return createDummyArrayHandler()
                                    } else {
                                        return mixedIn.pushGroup(definition, $i.handler).array($)
                                    }
                                } else {
                                    //start a shorthand group


                                    function createShorthandParsingState(
                                        groupDefinition: mschema.T.group,
                                        groupHandler: mth.IGroupHandler<PAnnotation>,

                                    ): {
                                        'wrapup'(
                                            annotation: PAnnotation,
                                        ): void
                                        'findNextValue': () => ValueContext | null
                                        'pushGroup'(
                                            definition: mschema.T.group,
                                            handler: mth.IValueHandler<PAnnotation>
                                        ): void
                                        'pushTaggedUnion'(
                                            definition: mschema.T.options,
                                            taggedUnionHandler: mth.ITaggedUnionHandler<PAnnotation>,
                                            optionHandler: mth.IValueHandler<PAnnotation>,
                                        ): void
                                    } {
                                        const stateImp: StateImp = {
                                            'stack': ps.createStack(pl.createEmptyArray()),
                                            'currentContext': createGroupContext(
                                                groupDefinition,
                                                true,
                                                groupHandler
                                            ),
                                            'optionContext': null,
                                        }
                                        return {
                                            'pushTaggedUnion': (definition, taggedUnionHandler, optionHandler) => {
                                                stateImp.optionContext = {
                                                    definition: definition,
                                                    taggedUnionHandler: taggedUnionHandler,
                                                    optionHandler: optionHandler,
                                                }
                                            },
                                            'pushGroup': (definition, handler) => {
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
                                            'wrapup': (annotation) => {
                                                function wrapupImp(state: StateImp) {
                                                    if (stateImp.optionContext !== null) {
                                                        defaultInitializeValue(
                                                            stateImp.optionContext.definition.value,
                                                            stateImp.optionContext.optionHandler,
                                                        )
                                                        stateImp.optionContext = null
                                                    }
                                                    switch (state.currentContext[0]) {
                                                        case 'group':
                                                            pl.cc(state.currentContext[1], ($) => {
                                                                const missing = $.elements.length - $.index
                                                                if (missing > 0) {
                                                                    onError({
                                                                        'annotation': annotation,
                                                                        'severity': ['error', {}],
                                                                        'type': ['missing elements', { elements: $.elements.slice($.index).map((ee) => ee.name) }],
                                                                    })
                                                                    for (let x = $.index; x !== $.elements.length; x += 1) {
                                                                        const ee = $.elements[x]

                                                                        defaultInitializeValue(
                                                                            ee.definition,
                                                                            ee.handler.onProperty({
                                                                                key: ee.name,
                                                                                token: [false],
                                                                                definition: ee.definition,
                                                                            }),
                                                                        )
                                                                    }
                                                                }
                                                                $.handler.onClose({
                                                                    token: $.isOuterGroup
                                                                        ? [true, {
                                                                            token: {},
                                                                            annotation: annotation,
                                                                        }]
                                                                        : [false],
                                                                })
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
                                            'findNextValue': () => {
                                                function findNextValueImp(): null | ValueContext {
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
                                                            return pl.cc(stateImp.currentContext[1], ($) => {
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
                                                            })
                                                        default:
                                                            return pl.au(stateImp.currentContext[0])
                                                    }
                                                }
                                                return findNextValueImp()
                                            },
                                        }
                                    }

                                    const state = createShorthandParsingState(
                                        definition,
                                        $i.handler.onGroup({
                                            type: ['shorthand', {
                                                token: $.token,
                                                annotation: $.annotation,
                                            }],
                                            definition: definition,
                                        }),
                                    )

                                    function createUnmarshallerForNextValue(): mh.IValueHandler<PAnnotation> {
                                        const nextValue = state.findNextValue()
                                        if (nextValue === null) {
                                            return {
                                                'array': ($) => {
                                                    onError({
                                                        'annotation': $.annotation,
                                                        'severity': ['error', {}],
                                                        'type': ['superfluous element', {}],
                                                    })
                                                    return createDummyArrayHandler()
                                                },
                                                'object': ($) => {
                                                    onError({
                                                        'annotation': $.annotation,
                                                        'severity': ['error', {}],
                                                        'type': ['superfluous element', {}],
                                                    })
                                                    return createDummyObjectHandler()
                                                },
                                                'taggedUnion': ($) => {
                                                    onError({
                                                        'annotation': $.annotation,
                                                        'severity': ['error', {}],
                                                        'type': ['superfluous element', {}],
                                                    })
                                                    return createDummyTaggedUnionHandler()
                                                },
                                                'simpleString': ($) => {
                                                    onError({
                                                        'annotation': $.annotation,
                                                        'severity': ['error', {}],
                                                        'type': ['superfluous element', {}],
                                                    })
                                                },
                                                'multilineString': ($) => {
                                                    onError({
                                                        'annotation': $.annotation,
                                                        'severity': ['error', {}],
                                                        'type': ['superfluous element', {}],
                                                    })
                                                },
                                            }
                                        } else {

                                            return createValueUnmarshaller(
                                                nextValue.definition,
                                                {
                                                    'flagNonDefaultPropertiesFound': $i.flagNonDefaultPropertiesFound,
                                                    'handler':
                                                        nextValue.handler,
                                                },
                                                {
                                                    'pushGroup': (definition, handler) => {
                                                        state.pushGroup(definition, handler)
                                                        return createUnmarshallerForNextValue()
                                                    },
                                                    'pushTaggedUnion': (definition, taggedUnionHandler, optionHandler) => {
                                                        state.pushTaggedUnion(definition, taggedUnionHandler, optionHandler)
                                                    },
                                                },
                                            )
                                        }
                                    }
                                    return {
                                        'element': () => {
                                            return createUnmarshallerForNextValue()
                                        },
                                        'onEnd': ($) => {
                                            state.wrapup(
                                                $.annotation,
                                            )
                                        },
                                    }
                                }
                            },
                            'object': ($) => {
                                if ($.token.type[0] !== 'verbose group') {
                                    if (mixedIn === null) {
                                        onError({
                                            'annotation': $.annotation,
                                            'severity': ['error', {}],
                                            'type': ['expected a group', {}],
                                        })
                                        defInitializeValue()
                                        return createDummyObjectHandler()
                                    } else {
                                        return mixedIn.pushGroup(definition, $i.handler).object($)
                                    }
                                } else {
                                    //start a verbose group
                                    const groupHandler = $i.handler.onGroup({
                                        type: ['verbose', {
                                            annotation: $.annotation,
                                            token: $.token,
                                        }],
                                        definition: definition,
                                    })

                                    const processedProperties: {
                                        [key: string]: {
                                            annotation: PAnnotation
                                            isNonDefault: boolean
                                        }
                                    } = {}
                                    return {
                                        'property': ($) => {
                                            const key = $.token.value
                                            if ($.token.wrapping[0] !== 'apostrophe') {
                                                onError({
                                                    'annotation': $.annotation,
                                                    'severity': ['warning', {}],
                                                    'type': ['property key does not have apostrophes', {}],
                                                })
                                            }
                                            return definition.properties.find(
                                                key,
                                                (propertyDefinition) => {
                                                    const pp = {
                                                        annotation: $.annotation,
                                                        isNonDefault: false,
                                                    }
                                                    processedProperties[key] = pp

                                                    const propertyHandler = groupHandler.onProperty({
                                                        key: $.token.value,
                                                        token: [true, $],
                                                        definition: propertyDefinition.value,
                                                    })
                                                    return createRequiredValueHandler(
                                                        createValueUnmarshaller(
                                                            propertyDefinition.value,
                                                            {
                                                                'flagNonDefaultPropertiesFound': () => {
                                                                    pp.isNonDefault = true
                                                                },
                                                                'handler': propertyHandler,
                                                            },
                                                            null,
                                                        ),
                                                        () => {
                                                            defaultInitializeValue(
                                                                propertyDefinition.value,
                                                                propertyHandler,
                                                            )
                                                        }
                                                    )
                                                },
                                                (keys) => {
                                                    onError({
                                                        'annotation': $.annotation,
                                                        'severity': ['error', {}],
                                                        'type': ['unknown property', { 'known properties': keys }],
                                                    })
                                                    groupHandler.onUnexpectedProperty({
                                                        token: $,
                                                        groupDefinition: definition,
                                                        expectedProperties: keys,
                                                    })
                                                    return createDummyRequiredValueHandler()
                                                }
                                            )
                                        },
                                        'anonymousProperty': () => {
                                            return createDummyValueHandler()
                                        },
                                        'onEnd': ($) => {
                                            let hadNonDefaultProperties = false

                                            definition.properties.forEach(() => false, (propDefinition, key) => {
                                                const pp = processedProperties[key]
                                                if (pp === undefined) {
                                                    defaultInitializeValue(
                                                        propDefinition.value,
                                                        groupHandler.onProperty({
                                                            key: key,
                                                            token: [false],
                                                            definition: propDefinition.value,
                                                        }),
                                                    )
                                                } else {
                                                    if (!pp.isNonDefault) {
                                                        onError({
                                                            'annotation': pp.annotation,
                                                            'severity': ['warning', {}],
                                                            'type': ['property has default value, remove', {}],
                                                        })
                                                    } else {
                                                        hadNonDefaultProperties = true
                                                    }
                                                }
                                            })
                                            if (hadNonDefaultProperties) {
                                                $i.flagNonDefaultPropertiesFound()
                                            }
                                            groupHandler.onClose({
                                                token: [true, {
                                                    token: {},
                                                    annotation: $.annotation,
                                                }],
                                            })
                                        },
                                    }
                                }
                            },
                            'taggedUnion': ($) => {
                                if (mixedIn === null) {
                                    onError({
                                        'annotation': $.annotation,
                                        'severity': ['error', {}],
                                        'type': ['expected a group', {}],
                                    })
                                    defInitializeValue()
                                    return createDummyTaggedUnionHandler()
                                } else {
                                    return mixedIn.pushGroup(definition, $i.handler).taggedUnion($)
                                }
                            },
                            'simpleString': ($) => {
                                if (mixedIn === null) {
                                    onError({
                                        'annotation': $.annotation,
                                        'severity': ['error', {}],
                                        'type': ['expected a group', {}],
                                    })
                                    defInitializeValue()
                                } else {
                                    return mixedIn.pushGroup(definition, $i.handler).simpleString($)
                                }
                            },
                            'multilineString': ($) => {
                                if (mixedIn === null) {
                                    onError({
                                        'annotation': $.annotation,
                                        'severity': ['error', {}],
                                        'type': ['expected a group', {}],
                                    })
                                    defInitializeValue()
                                } else {
                                    mixedIn.pushGroup(definition, $i.handler).multilineString($)
                                }
                            },

                        }
                    })
                }
                default:
                    return pl.au($.type[0])
            }
        }

        return {
            'exists': createValueUnmarshaller(
                $.schema['root type'].referencee().value,
                {
                    'handler': $i.handler,
                    'flagNonDefaultPropertiesFound': () => { },
                },
                null
            ),
            'missing': () => {
                defaultInitializeValue(
                    $.schema['root type'].referencee().value,
                    $i.handler,
                )
            },
        }
    }
}