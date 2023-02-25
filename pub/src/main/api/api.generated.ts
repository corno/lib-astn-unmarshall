import * as pt from 'pareto-core-types'

import * as gglo from "./glossary"

import * as gstring from "res-pareto-string"
import * as gtostring from "res-pareto-tostring"

export type CcreateErrorMessage = ($d: {
    readonly 'getArrayAsString': gtostring.FGetArrayAsString
    readonly 'getKeysAsString': gtostring.FGetKeysAsString
    readonly 'getLengthAsString': gtostring.FGetLengthAsString
    readonly 'getNumberOfKeysAsString': gtostring.FGetNumberOfKeysAsString
}) => gglo.FCreateUnmarshallErrorMessage

export type CcreateUnmarshaller = ($d: {
    readonly 'multilineStringIsEmpty': gglo.FMultilineStringIsEmpty
    readonly 'stringsAreEqual': gglo.FStringsAreEqual
}) => gglo.FCreateUnmarshaller

export type CdefaultInitializeValue = gglo.FDefaultInitializeValue

export type API = {
    createErrorMessage: CcreateErrorMessage
    createUnmarshaller: CcreateUnmarshaller
    defaultInitializeValue: CdefaultInitializeValue
}