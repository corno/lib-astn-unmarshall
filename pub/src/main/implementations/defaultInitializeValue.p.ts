import * as pl from 'pareto-core-lib'

import * as api from "../api"

export const $$:api.CdefaultInitializeValue = ($, $i) => {
    switch ($.type[0]) {
        case 'dictionary': {
            $i.onDictionary({
                token: [false],
                definition: $.type[1],
            }).onClose({
                token: [false],
            })
            break
        }
        case 'list': {
            $i.onList({
                token: [false],
                definition: $.type[1],
            }).onClose({
                token: [false],
            })
            break
        }
        case 'type reference': {
            const $e = $.type[1]
            $$(
                $e.type.referencee().value,
                $i.onTypeReference({
                    definition: $e,
                }),
                //onError,
            )
            break
        }
        case 'tagged union': {
            const $e = $.type[1]
            const defOpt = $e['default option'].referencee()
            $$(
                defOpt.value,
                $i.onTaggedUnion({
                    definition: $e,
                    token: [false],
                }).onOption({
                    name: $e['default option'].name,
                    token: [false],
                    definition: defOpt,
                }),
                //onError,
            )
            break
        }
        case 'simple string': {
            const $e = $.type[1]
            $i.onSimpleString({
                value: $e['default value'],
                token: [false],
                definition: $e,
            })
            break
        }
        case 'multiline string': {
            const $e = $.type[1]
            $i.onMultilineString({
                token: [false],
                definition: $e,
            })
            break
        }
        case 'group': {
            const $e = $.type[1]

            const groupHandler = $i.onGroup({
                type: ['omitted', {}],
                definition: $e,
            })
            $e.properties.forEach(() => false, (propDef, key) => {
                $$(
                    propDef.value,
                    groupHandler.onProperty({
                        key: key,
                        token: [false],
                        definition: propDef.value,
                    }),
                    //onError,
                )
            })
            break
        }
        default:
            pl.au($.type[0])
    }
}
