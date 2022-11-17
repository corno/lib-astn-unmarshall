import * as tth from "astn-typedhandlers-api"

import * as h from "astn-handlers-api"
import { ITypedValueHandler, Schema } from "astn-typedhandlers-api"

import * as inf from "../interface"

export type OnError<PAnnotation> = ($: inf.TAnnotatedUnmarshallError<PAnnotation>) => void


export type CreateValueUnmarshaller =<PAnnotation>(
    definition: tth.ValueDefinition,
    handler: tth.ITypedValueHandler<PAnnotation>,
    onError: OnError<PAnnotation>,
    flagNonDefaultPropertiesFound: () => void,
    mixedIn: null | MixidIn<PAnnotation>,
    dummyHandlers: inf.DummyHandlers<PAnnotation>,
) => h.IValueHandler<PAnnotation>


export type CreateUnmarshaller = <PAnnotation>(
    $: {
        schema: Schema
    },
    $i: {
        handler: ITypedValueHandler<PAnnotation>
        onError: ($: inf.TAnnotatedUnmarshallError<PAnnotation>) => void
        dummyHandlers: inf.DummyHandlers<PAnnotation>
    }
) => h.IRequiredValueHandler<PAnnotation>

// export type onError = (
//     type: inf.UnmarshallErrorType, severity: inf.DiagnosticSeverity
// ) => void