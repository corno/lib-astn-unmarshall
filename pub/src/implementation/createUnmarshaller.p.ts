import { IRequiredValueHandler } from "astn-handlers-api"
import { createValueUnmarshaller } from "./createValueUnmarshaller"
import { defaultInitializeValue } from "./defaultInitializeValue"

import * as inf from "../interface"

export function createUnmarshaller<PAnnotation>(
    $: inf.CreateUnmarshaller_Data,
    $i: inf.CreateUnmarshaller_Interfaces<PAnnotation>,
    $d: inf.CreateUnmarshaller_Dependencies<PAnnotation>,
): IRequiredValueHandler<PAnnotation> {
    return {
        exists: createValueUnmarshaller(
            $.schema["root type"].get().value,
            $i.handler,
            (type, annotation, severity) => {
                $i.onError({
                    type: type,
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
                $.schema["root type"].get().value,
                $i.handler,
            )
        },
    }
}
