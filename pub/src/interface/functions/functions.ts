import * as h from "astn-handlers-api"
import * as th from "astn-typedhandlers-api"

import { DummyHandlers } from "./interfaces/DummyHandlers"
import { AnnotatedUnmarshallError } from "./types/UnmarshallError"

export type CreateUnmarshaller_Data = {
    schema: th.Schema
}

export type CreateUnmarshaller_Interfaces<PAnnotation> = {
    onError: (
        $: AnnotatedUnmarshallError<PAnnotation>
    ) => void,
    handler: th.ITypedValueHandler<PAnnotation>
}

export type CreateUnmarshaller_Dependencies<PAnnotation> = {
    dummyHandlers: DummyHandlers<PAnnotation>
}

export type CreateUnmarshaller = <PAnnotation> (
    $: CreateUnmarshaller_Data,
    $i: CreateUnmarshaller_Interfaces<PAnnotation>,
    $d: CreateUnmarshaller_Dependencies<PAnnotation>
) => h.IRequiredValueHandler<PAnnotation>