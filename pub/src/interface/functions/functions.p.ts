import * as h from "api-astn-handlers"
import * as th from "api-astn-typedhandlers"

import { TAnnotatedUnmarshallError } from "../types/UnmarshallError.p"

export type CreateUnmarshaller = <PAnnotation> (
    $: {
        schema: th.Schema
    },
    $i: {
        onError: (
            $: TAnnotatedUnmarshallError<PAnnotation>
        ) => void,
        handler: th.ITypedValueHandler<PAnnotation>
    },
) => h.IRequiredValueHandler<PAnnotation>