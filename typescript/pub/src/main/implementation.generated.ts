import { API } from "./api.generated"
import { $$ as icreateErrorMessage } from "./implementations/createErrorMessage.s.f"
import { $$ as icreateUnmarshallerCreator } from "./implementations/createUnmarshallerCreator.a.c"
import { $$ as idefaultInitializeValue } from "./implementations/defaultInitializeValue.a.c"

export const $api: API = {
    'createErrorMessage': icreateErrorMessage,
    'createUnmarshallerCreator': icreateUnmarshallerCreator,
    'defaultInitializeValue': idefaultInitializeValue,
}