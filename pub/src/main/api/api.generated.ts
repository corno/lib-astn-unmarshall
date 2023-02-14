import * as pt from 'pareto-core-types'

import * as glo from "./glossary"

import * as mtostring from "res-pareto-tostring"

export type CcreateErrorMessage = ($d: {
    readonly 'getArrayAsString': mtostring.FGetArrayAsString
    readonly 'getKeysAsString': mtostring.FGetKeysAsString
    readonly 'getLengthAsString': mtostring.FGetLengthAsString
    readonly 'getNumberOfKeysAsString': mtostring.FGetNumberOfKeysAsString
}) => glo.FCreateUnmarshallErrorMessage

export type API = {
    createErrorMessage: CcreateErrorMessage
}