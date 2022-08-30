import { createUnmarshallErrorMessage } from "./createUnmarshallErrorMessage";

import * as api from "../interface"
import { createUnmarshaller } from "./createUnmarshaller";


// type API = {
//     createUnmarshaller: api.CreateUnmarshaller,
//     createUnmarshallErrorMessage: (error: api.UnmarshallError) => string
// }


export function init(): API {
    return {
        createUnmarshaller: createUnmarshaller,
        createUnmarshallErrorMessage: createUnmarshallErrorMessage,
    }
}
