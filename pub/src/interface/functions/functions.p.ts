import * as mh from "glo-astn-handlers"
import * as mth from "glo-astn-typedhandlers"
import * as mschema from "glo-astn-schema"

import { TAnnotatedUnmarshallError } from "../types/UnmarshallError.p"

export type CreateUnmarshaller = <PAnnotation> (
    $: {
        schema: mschema.T.root
    },
    $i: {
        onError: (
            $: TAnnotatedUnmarshallError<PAnnotation>
        ) => void,
        handler: mth.IValueHandler<PAnnotation>
    },
) => mh.IRequiredValueHandler<PAnnotation>