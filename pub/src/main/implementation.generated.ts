import { API } from "./api"
import { $$ as icreateErrorMessage } from "./implementations/createErrorMessage.p"

export const $a: API = {
    'createErrorMessage': icreateErrorMessage,
}