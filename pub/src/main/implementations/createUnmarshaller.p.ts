import { IRequiredValueHandler } from "glo-astn-handlers"
import { createValueUnmarshaller } from "./createValueUnmarshaller.p"
import { $$ as defaultInitializeValue } from "./defaultInitializeValue.p"

import * as api from "../api"

export const $$: api.CcreateUnmarshaller = ($) => {
    return {
        exists: createValueUnmarshaller(
            $.schema["root type"].referencee,
            $i.handler,
            (type, annotation, severity) => {
                $i.onError({
                    error: type,
                    annotation: annotation,
                    severity: severity
                })
            },
            () => { },
            null,
            $d.dummyHandlers,
        ),
        missing: () => {
            defaultInitializeValue(
                $.schema["root type"].referencee().value,
                $i.handler,
            )
        },
    }
}
