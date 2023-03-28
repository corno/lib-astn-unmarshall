import * as pl from 'pareto-core-lib'

import { A } from "../api.generated"

export const $$: A.defaultInitializeValue = () => {
    return ($, $i) => {
        switch ($.type[0]) {
            case 'dictionary': {
                $i.handler.dictionary({
                    token: [false],
                    definition: $.type[1],
                }).end({
                    token: [false],
                })
                break
            }
            case 'list': {
                $i.handler.list({
                    token: [false],
                    definition: $.type[1],
                }).end({
                    token: [false],
                })
                break
            }
            case 'type reference': {
                const $e = $.type[1]
                $$(
                    $e.type.referencee().value,
                    $i.handler.typeReference({
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
                    $i.handler.onTaggedUnion({
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
                $i.handler.simpleString({
                    value: $e['default value'],
                    token: [false],
                    definition: $e,
                })
                break
            }
            case 'multiline string': {
                const $e = $.type[1]
                $i.handler.multilineString({
                    token: [false],
                    definition: $e,
                })
                break
            }
            case 'group': {
                const $e = $.type[1]

                const groupHandler = $i.handler.group({
                    type: ['omitted', null],
                    definition: $e,
                })
                $e.properties.__forEach(() => false, (propDef, key) => {
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
}