import { API } from "./definition/api.generated"
import { $$ as icreateErrorMessage } from "./implementations/createErrorMessage.p"
import { $$ as icreateUnmarshaller } from "./implementations/createUnmarshaller.p"
import { $$ as idefaultInitializeValue } from "./implementations/defaultInitializeValue.p"

export const $a: API = {
    'createErrorMessage': icreateErrorMessage,
    'createUnmarshaller': icreateUnmarshaller,
    'defaultInitializeValue': idefaultInitializeValue,
}