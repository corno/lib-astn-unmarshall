import * as pt from 'pareto-core-types'

import * as g_string from "res-pareto-string"
import * as g_this from "./glossary"
import * as g_tostring from "res-pareto-tostring"

export type createErrorMessage = ($d: {
    readonly 'getArrayAsString': g_tostring.F.GetArrayAsString
    readonly 'getKeysAsString': g_tostring.F.GetKeysAsString
    readonly 'getLengthAsString': g_tostring.F.GetLengthAsString
    readonly 'getNumberOfKeysAsString': g_tostring.F.GetNumberOfKeysAsString
}) => g_this.F.CreateUnmarshallErrorMessage

export type createUnmarshaller = ($d: {
    readonly 'multilineStringIsEmpty': g_this.F.MultilineStringIsEmpty
    readonly 'stringsAreEqual': g_this.F.StringsAreEqual
}) => g_this.F.CreateUnmarshaller

export type defaultInitializeValue = g_this.F.DefaultInitializeValue

export type API = {
    createErrorMessage: createErrorMessage
    createUnmarshaller: createUnmarshaller
    defaultInitializeValue: defaultInitializeValue
}