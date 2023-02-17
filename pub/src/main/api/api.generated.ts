import * as pt from 'pareto-core-types'

import * as glo from "./glossary"

import * as mstring from "res-pareto-string"
import * as mtostring from "res-pareto-tostring"

export type CcreateErrorMessage = ($d: {
    readonly 'getArrayAsString': mtostring.FGetArrayAsString
    readonly 'getKeysAsString': mtostring.FGetKeysAsString
    readonly 'getLengthAsString': mtostring.FGetLengthAsString
    readonly 'getNumberOfKeysAsString': mtostring.FGetNumberOfKeysAsString
}) => glo.FCreateUnmarshallErrorMessage

export type CcreateUnmarshaller = ($d: {
    readonly 'multilineStringIsEmpty': glo.FMultilineStringIsEmpty
    readonly 'stringsAreEqual': glo.FStringsAreEqual
}) => glo.FCreateUnmarshaller

export type CdefaultInitializeValue = glo.FDefaultInitializeValue

export type API = {
    createErrorMessage: CcreateErrorMessage
    createUnmarshaller: CcreateUnmarshaller
    defaultInitializeValue: CdefaultInitializeValue
}