import * as pl from "pareto-core-lib"
import * as tth from "api-astn-typedhandlers"

//export type OnError<PAnnotation> = (message: inf.UnmarshallErrorType, annotation: PAnnotation, severity: inf.DiagnosticSeverity) => void

export function defaultInitializeValue<PAnnotation>(
    definition: tth.ValueDefinition,
    handler: tth.ITypedValueHandler<PAnnotation>,
    //onError: OnError<PAnnotation>,
): void {
    switch (definition.type[0]) {
        case "dictionary": {
            handler.onDictionary({
                token: null,
                definition: definition.type[1],
            }).onClose({
                token: null,
            })
            break
        }
        case "list": {
            handler.onList({
                token: null,
                definition: definition.type[1],
            }).onClose({
                token: null,
            })
            break
        }
        case "type reference": {
            const $e = definition.type[1]
            defaultInitializeValue(
                $e.type.get().value,
                handler.onTypeReference({
                    definition: $e,
                }),
                //onError,
            )
            break
        }
        case "tagged union": {
            const $e = definition.type[1]
            const defOpt = $e["default option"].get()
            defaultInitializeValue(
                defOpt.value,
                handler.onTaggedUnion({
                    definition: $e,
                    token: null,
                }).onOption({
                    name: $e["default option"].name,
                    token: null,
                    definition: defOpt,
                }),
                //onError,
            )
            break
        }
        case "simple string": {
            const $e = definition.type[1]
            handler.onSimpleString({
                value: $e["default value"],
                token: null,
                definition: $e,
            })
            break
        }
        case "multiline string": {
            const $e = definition.type[1]
            handler.onMultilineString({
                token: null,
                definition: $e,
            })
            break
        }
        case "group": {
            const $e = definition.type[1]

            const groupHandler = handler.onGroup({
                type: ["omitted", {}],
                definition: $e,
            })
            $e.properties.forEach(() => false, (propDef, key) => {
                defaultInitializeValue(
                    propDef.value,
                    groupHandler.onProperty({
                        key: key,
                        token: null,
                        definition: propDef.value,
                    }),
                    //onError,
                )
            })
            break
        }
        default:
            pl.au(definition.type[0])
    }
}
