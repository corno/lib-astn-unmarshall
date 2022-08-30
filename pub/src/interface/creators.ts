import * as h from "astn-handlers-api"
import * as th from "astn-typedhandlers-api"
import { DummyHandlers } from "./interfaces/DummyHandlers"
import { AnnotatedUnmarshallError } from "./types/UnmarshallError"

export type CreateUnmarshaller_Data = {
    schema: th.Schema
}

export type CreateUnmarshaller_Interfaces<Annotation> = {
    onError: (
        $: AnnotatedUnmarshallError<Annotation>
    ) => void,
    handler: th.ITypedValueHandler<Annotation>
}

export type CreateUnmarshaller_Dependencies<Annotation> = {
    dummyHandlers: DummyHandlers<Annotation>
}

export type CreateUnmarshaller = <Annotation> (
    $: CreateUnmarshaller_Data,
    $i: CreateUnmarshaller_Interfaces<Annotation>,
    $d: CreateUnmarshaller_Dependencies<Annotation>
) => h.IRequiredValueHandler<Annotation>