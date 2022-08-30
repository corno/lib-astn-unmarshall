import * as tth from "astn-typedhandlers-api"

import * as h from "astn-handlers-api"
import { ITypedValueHandler, Schema } from "astn-typedhandlers-api"

import * as inf from "../interface"

export type MixidIn<Annotation> = {
    pushGroup: (
        definition: tth.GroupDefinition,
        groupContainerHandler: tth.ITypedValueHandler<Annotation>
    ) => h.IValueHandler<Annotation>
    pushTaggedUnion: (
        definition: tth.OptionDefinition,
        taggedUnionHandler: tth.ITypedTaggedUnionHandler<Annotation>,
        optionHandler: tth.ITypedValueHandler<Annotation>,
    ) => void
}

export type OnError<Annotation> = ($: inf.AnnotatedUnmarshallError<Annotation>) => void


export type CreateValueUnmarshaller =<Annotation>(
    definition: tth.ValueDefinition,
    handler: tth.ITypedValueHandler<Annotation>,
    onError: OnError<Annotation>,
    flagNonDefaultPropertiesFound: () => void,
    mixedIn: null | MixidIn<Annotation>,
    dummyHandlers: inf.DummyHandlers<Annotation>,
) => h.IValueHandler<Annotation>


export type CreateUnmarshaller = <Annotation>(
    $: {
        schema: Schema
    },
    $i: {
        handler: ITypedValueHandler<Annotation>
        onError: ($: inf.AnnotatedUnmarshallError<Annotation>) => void
        dummyHandlers: inf.DummyHandlers<Annotation>
    }
) => h.IRequiredValueHandler<Annotation>

// export type onError = (
//     type: inf.UnmarshallErrorType, severity: inf.DiagnosticSeverity
// ) => void