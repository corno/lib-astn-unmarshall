import * as pl from 'pareto-core-lib'
import * as ps from 'pareto-core-state'

import { $$ as defaultInitializeValue } from "./defaultInitializeValue.a.b"

import { A } from "../api.generated"

import * as g_this from "../glossary"
import * as g_th from "glo-astn-typedhandlers"
import * as g_schema from "glo-astn-schema"
import * as g_h from "glo-astn-handlers"


export const $$: A.createUnmarshallerCreator = <GAnnotation, GSchemaAnnotation>(): g_this.ASYNC.A.C.CreateUnmarshallerCreator<GAnnotation, GSchemaAnnotation> => {

    return ($is) => {
        return ($) => {


            function createDummyObjectHandler(): g_h.ASYNC.I.ObjectHandler<GAnnotation> {
                return {
                    'data': {
                        property: () => {
                            return createDummyRequiredValueHandler()
                        },
                        anonymousProperty: () => {
                            return createDummyValueHandler()
                        },
                    },
                    'end': () => { },
                }
            }
            function createDummyArrayHandler(): g_h.ASYNC.I.ArrayHandler<GAnnotation> {
                return {
                    'data': () => {
                        return createDummyValueHandler()
                    },
                    'end': () => { }
                }
            }
            function createDummyTaggedUnionHandler(): g_h.ASYNC.I.TaggedUnionHandler<GAnnotation> {
                return {
                    'option': () => createDummyRequiredValueHandler(),
                    'missingOption': () => createDummyRequiredValueHandler(),
                }
            }
            function createDummyValueHandler(): g_h.ASYNC.I.ValueHandler<GAnnotation> {

                return {
                    'object': () => {
                        return createDummyObjectHandler()
                    },
                    'array': () => {
                        return createDummyArrayHandler()
                    },
                    'taggedUnion': () => {
                        return createDummyTaggedUnionHandler()
                    },
                    'simpleString': () => {
                    },
                    'multilineString': () => {
                    }
                }
            }

            function createDummyRequiredValueHandler(): g_h.ASYNC.I.RequiredValueHandler<GAnnotation> {
                return {
                    'missing': () => {
                    },
                    'exists': createDummyValueHandler()
                }

            }
            type MixidIn = {
                readonly 'pushGroup': (
                    definition: g_schema.T.group<GSchemaAnnotation>,
                    groupContainerHandler: g_th.ASYNC.I.ValueHandler<GAnnotation>
                ) => g_h.ASYNC.I.ValueHandler<GAnnotation>
                'pushTaggedUnion': (
                    definition: g_schema.T.options<GSchemaAnnotation>,
                    taggedUnionHandler: g_th.ASYNC.I.TaggedUnionHandler<GAnnotation>,
                    optionHandler: g_th.ASYNC.I.ValueHandler<GAnnotation>,
                ) => void
            }

            function createValueUnmarshaller(
                $: g_schema.T.value<GSchemaAnnotation>,
                $i: {
                    'handler': g_th.ASYNC.I.ValueHandler<GAnnotation>,
                    'flagNonDefaultPropertiesFound': () => void,
                },
                mixedIn: null | MixidIn,
            ): g_h.ASYNC.I.ValueHandler<GAnnotation> {

                type ValueContext = {
                    'definition': g_schema.T.value<GSchemaAnnotation>
                    'handler': g_th.ASYNC.I.ValueHandler<GAnnotation>
                }

                function createGroupContext(
                    definition: g_schema.T.group<GSchemaAnnotation>,
                    isOuterGroup: boolean,
                    subHandler: g_th.ASYNC.I.GroupHandler<GAnnotation>,
                ): Context {
                    const expectedElements = ps.createStack(definition.properties)
                    definition.properties.__forEach(() => false, (propDefinition, key) => {
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
                            'definition': g_schema.T.value<GSchemaAnnotation>
                            'handler': g_th.ASYNC.I.GroupHandler<GAnnotation>
                        }[]
                        'handler': g_th.ASYNC.I.GroupHandler<GAnnotation>
                        'index': number
                    }]
                //FIXME move option context here so tagged union onEnd can be called

                type StateImp = {
                    'stack': ps.Stack<Context>
                    'currentContext': Context
                    'optionContext': null | {
                        'definition': g_schema.T.options<GSchemaAnnotation>
                        'optionHandler': g_th.ASYNC.I.ValueHandler<GAnnotation>
                        'taggedUnionHandler': g_th.ASYNC.I.TaggedUnionHandler<GAnnotation>
                    }
                }

                function createRequiredValueHandler(
                    handler: g_h.ASYNC.I.ValueHandler<GAnnotation>,
                    onMissing: () => void,
                ): g_h.ASYNC.I.RequiredValueHandler<GAnnotation> {
                    return {
                        exists: handler,
                        missing: onMissing,
                    }
                }

                function createUnexpectedArrayHandler(
                    message: g_this.T.Error._ltype<GAnnotation, GSchemaAnnotation>,
                    annotation: GAnnotation,
                ): g_h.ASYNC.I.ArrayHandler<GAnnotation> {
                    $is.errorHandler.data({
                        'type': message,
                        'annotation': annotation,
                        'severity': ['error', null],
                    })
                    return createDummyArrayHandler()
                }

                function createUnexpectedObjectHandler(
                    message: g_this.T.Error._ltype<GAnnotation, GSchemaAnnotation>,
                    annotation: GAnnotation,
                ): g_h.ASYNC.I.ObjectHandler<GAnnotation> {
                    $is.errorHandler.data({
                        'type': message,
                        'annotation': annotation,
                        'severity': ['error', null],
                    })
                    return createDummyObjectHandler()
                }

                function createUnexpectedTaggedUnionHandler(
                    message: g_this.T.Error._ltype<GAnnotation, GSchemaAnnotation>,
                    annotation: GAnnotation,
                ): g_h.ASYNC.I.TaggedUnionHandler<GAnnotation> {
                    $is.errorHandler.data({
                        'type': message,
                        'annotation': annotation,
                        'severity': ['error', null],
                    })
                    return createDummyTaggedUnionHandler()
                }

                function createUnexpectedStringHandler(
                    message: g_this.T.Error._ltype<GAnnotation, GSchemaAnnotation>,
                    annotation: GAnnotation,
                ): void {
                    $is.errorHandler.data({
                        'type': message,
                        'annotation': annotation,
                        'severity': ['error', null],
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
                                        ['expected a dictionary', null],
                                        $.annotation,
                                    )
                                },
                                'object': ($) => {
                                    const foundKeysBuilder = pc.createArrayBuilderFIXME<string>()
                                    if ($.token.type[0] !== 'dictionary') {
                                        $is.errorHandler.data({
                                            'annotation': $.annotation,
                                            'severity': ['warning', null],
                                            'type': ['object is not a dictionary', null],
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
                                                $is.errorHandler.data({
                                                    'annotation': $.annotation,
                                                    'severity': ['warning', null],
                                                    'type': ['entry key does not have quotes', null],
                                                })
                                            }
                                            foundKeysBuilder.toArray().forEach(($) => {
                                                if ($ === prop.token.value) {
                                                    $is.errorHandler.data({
                                                        'annotation': prop.annotation,
                                                        'severity': ['error', null],
                                                        'type': ['duplicate key', null],
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
                                        ['expected a dictionary', null],
                                        $.annotation,
                                    )
                                },
                                'simpleString': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedStringHandler(
                                        ['expected a dictionary', null],
                                        $.annotation,
                                    )
                                },
                                'multilineString': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedStringHandler(
                                        ['expected a dictionary', null],
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
                                        $is.errorHandler.data({
                                            'annotation': $.annotation,
                                            'severity': ['error', null],
                                            'type': ['array is not a list', null],
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
                                        ['expected a list', null],
                                        $.annotation,
                                    )
                                },
                                'taggedUnion': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedTaggedUnionHandler(
                                        ['expected a list', null],
                                        $.annotation,
                                    )
                                },
                                'simpleString': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedStringHandler(
                                        ['expected a list', null],
                                        $.annotation,
                                    )
                                },
                                'multilineString': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedStringHandler(
                                        ['expected a list', null],
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
                                optionToken: g_h.T.SimpleStringToken<GAnnotation>,
                                definition: g_schema.T.tagged__union<GSchemaAnnotation>,
                                tuHandler: g_th.ASYNC.I.TaggedUnionHandler<GAnnotation>,
                                unknownCallback: () => T,
                                knownCallback: (option: g_schema.T.options<GSchemaAnnotation>, handler: g_th.ASYNC.I.ValueHandler<GAnnotation>) => T,
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
                                        '$is.errorHandler.data'({
                                            'annotation': optionToken.annotation,
                                            'severity': ['error', null],
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
                                        ['expected a tagged union', null],
                                        $.annotation,
                                    )
                                },
                                'object': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedObjectHandler(
                                        ['expected a tagged union', null],
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
                                            '$is.errorHandler.data'({
                                                'annotation': $,
                                                'severity': ['error', null],
                                                'type': ['missing option', null],
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
                                                ['expected a tagged union', null],
                                                $.annotation,
                                            )
                                        }
                                    } else {
                                        defInitializeValue()
                                        return createUnexpectedStringHandler(
                                            ['expected a tagged union', null],
                                            $.annotation,
                                        )
                                    }
                                },
                                'multilineString': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedStringHandler(
                                        ['expected a tagged union', null],
                                        $.annotation,
                                    )
                                },
                            }
                        })
                    }
                    case 'simple string': {
                        return pl.cc($.type[1], ($) => {
                            const definition = $
                            const error: g_this.T.Error._ltype<GAnnotation, GSchemaAnnotation> = definition.quoted
                                ? ['expected an unquoted string', null]
                                : ['expected a quoted string', null]
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
                                                    $is.errorHandler.data({
                                                        'annotation': ssAnnotation,
                                                        'severity': ['warning', null],
                                                        'type': ['value should have quotes', null],
                                                    })
                                                }
                                            })
                                            break
                                        }
                                        case 'quote': {
                                            pl.cc($.token.wrapping[1], ($) => {
                                                if (!definition.quoted) {
                                                    $is.errorHandler.data({
                                                        'annotation': ssAnnotation,
                                                        'severity': ['warning', null],
                                                        'type': ['value should not have quotes', null],
                                                    })
                                                }
                                            })
                                            break
                                        }
                                        case 'apostrophe': {
                                            pl.cc($.token.wrapping[1], ($) => {
                                                $is.errorHandler.data({
                                                    'annotation': ssAnnotation,
                                                    'severity': ['warning', null],
                                                    'type': definition.quoted
                                                        ? ['value should have quotes instead of apostrophes', null]
                                                        : ['value should not have apostrophes', null]
                                                    ,
                                                })
                                            })
                                            break
                                        }
                                        default:
                                            pl.au($.token.wrapping[0])
                                    }
                                    $i.handler.simpleString({
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
                                        ['expected a multiline string', null],
                                        $.annotation,
                                    )
                                },
                                'object': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedObjectHandler(
                                        ['expected a multiline string', null],
                                        $.annotation,
                                    )
                                },
                                'taggedUnion': ($) => {
                                    defInitializeValue()
                                    return createUnexpectedTaggedUnionHandler(
                                        ['expected a multiline string', null],
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
                                    $i.handler.multilineString({
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
                                        ['expected a multiline string', null],
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
                                            $is.errorHandler.data({
                                                'annotation': $.annotation,
                                                'severity': ['error', null],
                                                'type': ['expected a group', null],
                                            })
                                            defInitializeValue()
                                            return createDummyArrayHandler()
                                        } else {
                                            return mixedIn.pushGroup(definition, $i.handler).array($)
                                        }
                                    } else {
                                        //start a shorthand group


                                        function createShorthandParsingState(
                                            groupDefinition: g_schema.T.group,
                                            groupHandler: g_th.ASYNC.I.GroupHandler<GAnnotation>,

                                        ): {
                                            'wrapup'(
                                                annotation: GAnnotation,
                                            ): void
                                            'findNextValue': () => ValueContext | null
                                            'pushGroup'(
                                                definition: g_schema.T.group,
                                                handler: g_th.ASYNC.I.ValueHandler<GAnnotation>
                                            ): void
                                            'pushTaggedUnion'(
                                                definition: g_schema.T.options,
                                                taggedUnionHandler: g_th.ASYNC.I.TaggedUnionHandler<GAnnotation>,
                                                optionHandler: g_th.ASYNC.I.ValueHandler<GAnnotation>,
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
                                                            type: ['mixin', null],
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
                                                                        $is.errorHandler.data({
                                                                            'annotation': annotation,
                                                                            'severity': ['error', null],
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

                                        function createUnmarshallerForNextValue(): g_h.ASYNC.I.ValueHandler<GAnnotation> {
                                            const nextValue = state.findNextValue()
                                            if (nextValue === null) {
                                                return {
                                                    'array': ($) => {
                                                        $is.errorHandler.data({
                                                            'annotation': $.annotation,
                                                            'severity': ['error', null],
                                                            'type': ['superfluous element', null],
                                                        })
                                                        return createDummyArrayHandler()
                                                    },
                                                    'object': ($) => {
                                                        $is.errorHandler.data({
                                                            'annotation': $.annotation,
                                                            'severity': ['error', null],
                                                            'type': ['superfluous element', null],
                                                        })
                                                        return createDummyObjectHandler()
                                                    },
                                                    'taggedUnion': ($) => {
                                                        $is.errorHandler.data({
                                                            'annotation': $.annotation,
                                                            'severity': ['error', null],
                                                            'type': ['superfluous element', null],
                                                        })
                                                        return createDummyTaggedUnionHandler()
                                                    },
                                                    'simpleString': ($) => {
                                                        $is.errorHandler.data({
                                                            'annotation': $.annotation,
                                                            'severity': ['error', null],
                                                            'type': ['superfluous element', null],
                                                        })
                                                    },
                                                    'multilineString': ($) => {
                                                        $is.errorHandler.data({
                                                            'annotation': $.annotation,
                                                            'severity': ['error', null],
                                                            'type': ['superfluous element', null],
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
                                            $is.errorHandler.data({
                                                'annotation': $.annotation,
                                                'severity': ['error', null],
                                                'type': ['expected a group', null],
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
                                                annotation: GAnnotation
                                                isNonDefault: boolean
                                            }
                                        } = {}
                                        return {
                                            'property': ($) => {
                                                const key = $.token.value
                                                if ($.token.wrapping[0] !== 'apostrophe') {
                                                    $is.errorHandler.data({
                                                        'annotation': $.annotation,
                                                        'severity': ['warning', null],
                                                        'type': ['property key does not have apostrophes', null],
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
                                                        $is.errorHandler.data({
                                                            'annotation': $.annotation,
                                                            'severity': ['error', null],
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
                                                            $is.errorHandler.data({
                                                                'annotation': pp.annotation,
                                                                'severity': ['warning', null],
                                                                'type': ['property has default value, remove', null],
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
                                        $is.errorHandler.data({
                                            'annotation': $.annotation,
                                            'severity': ['error', null],
                                            'type': ['expected a group', null],
                                        })
                                        defInitializeValue()
                                        return createDummyTaggedUnionHandler()
                                    } else {
                                        return mixedIn.pushGroup(definition, $i.handler).taggedUnion($)
                                    }
                                },
                                'simpleString': ($) => {
                                    if (mixedIn === null) {
                                        $is.errorHandler.data({
                                            'annotation': $.annotation,
                                            'severity': ['error', null],
                                            'type': ['expected a group', null],
                                        })
                                        defInitializeValue()
                                    } else {
                                        return mixedIn.pushGroup(definition, $i.handler).simpleString($)
                                    }
                                },
                                'multilineString': ($) => {
                                    if (mixedIn === null) {
                                        $is.errorHandler.data({
                                            'annotation': $.annotation,
                                            'severity': ['error', null],
                                            'type': ['expected a group', null],
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
}