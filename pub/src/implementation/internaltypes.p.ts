import * as tth from "astn-typedhandlers-api"

import * as h from "astn-handlers-api"
import { ITypedValueHandler, Schema } from "astn-typedhandlers-api"

import * as inf from "../interface"

export type MixidIn<PAnnotation> = {
    pushGroup: (
        definition: tth.GroupDefinition,
        groupContainerHandler: tth.ITypedValueHandler<PAnnotation>
    ) => h.IValueHandler<PAnnotation>
    pushTaggedUnion: (
        definition: tth.OptionDefinition,
        taggedUnionHandler: tth.ITypedTaggedUnionHandler<PAnnotation>,
        optionHandler: tth.ITypedValueHandler<PAnnotation>,
    ) => void
}

export type OnError<PAnnotation> = ($: inf.AnnotatedUnmarshallError<PAnnotation>) => void


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
        onError: ($: inf.AnnotatedUnmarshallError<PAnnotation>) => void
        dummyHandlers: inf.DummyHandlers<PAnnotation>
    }
) => h.IRequiredValueHandler<PAnnotation>

// export type onError = (
//     type: inf.UnmarshallErrorType, severity: inf.DiagnosticSeverity
// ) => void