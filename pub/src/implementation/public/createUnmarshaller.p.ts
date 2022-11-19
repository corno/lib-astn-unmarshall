import { IRequiredValueHandler } from "api-astn-handlers"
// import { createValueUnmarshaller } from "../private/createValueUnmarshaller.p"
// import { defaultInitializeValue } from "../private/defaultInitializeValue.p"

// import * as api from "../../interface"

// export const createUnmarshaller: api.CreateUnmarshaller = ($, $i
// ) => {
//     return {
//         exists: createValueUnmarshaller(
//             $.schema["root type"].get().value,
//             $i.handler,
//             (type, annotation, severity) => {
//                 $i.onError({
//                     error: type,
//                     annotation: annotation,
//                     severity: severity
//                 })
//             },
//             () => { },
//             null,
//             $d.dummyHandlers,
//         ),
//         missing: () => {
//             defaultInitializeValue(
//                 $.schema["root type"].get().value,
//                 $i.handler,
//             )
//         },
//     }
// }
