import * as pt from 'pareto-core-types'

import * as gstring from "res-pareto-string"
import * as gthis from "./glossary"
import * as gtostring from "res-pareto-tostring"

export type CcreateErrorMessage = ($d: {
    readonly 'getArrayAsString': gtostring.FGetArrayAsString
    readonly 'getKeysAsString': gtostring.FGetKeysAsString
    readonly 'getLengthAsString': gtostring.FGetLengthAsString
    readonly 'getNumberOfKeysAsString': gtostring.FGetNumberOfKeysAsString
}) => gthis.FCreateUnmarshallErrorMessage

export type CcreateUnmarshaller = ($d: {
    readonly 'multilineStringIsEmpty': gthis.FMultilineStringIsEmpty
    readonly 'stringsAreEqual': gthis.FStringsAreEqual
}) => gthis.FCreateUnmarshaller

export type CdefaultInitializeValue = gthis.FDefaultInitializeValue

export type API = {
    createErrorMessage: CcreateErrorMessage
    createUnmarshaller: CcreateUnmarshaller
    defaultInitializeValue: CdefaultInitializeValue
}