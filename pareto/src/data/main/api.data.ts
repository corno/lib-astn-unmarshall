import * as pd from 'pareto-core-data'

import { functionReference, constructor, algorithm, typeReference } from "lib-pareto-typescript-project/dist/submodules/api/shorthands"

import * as gapi from "lib-pareto-typescript-project/dist/submodules/api"
const d = pd.d

export const $: gapi.T.API<pd.SourceLocation> = {
    'algorithms': d({
        "createErrorMessage": algorithm(functionReference("this", {}, "CreateUnmarshallErrorMessage"), constructor(null, {
            "getArrayAsString": functionReference("tostring", {}, "GetArrayAsString"),
            "getKeysAsString": functionReference("tostring", {}, "GetKeysAsString"),
            "getNumberOfKeysAsString": functionReference("tostring", {}, "GetNumberOfKeysAsString"),
            "getLengthAsString": functionReference("tostring", {}, "GetLengthAsString"),
        })),
        "createUnmarshaller": algorithm(functionReference("this", {}, "CreateUnmarshaller"), constructor(null, {
            "multilineStringIsEmpty": functionReference("this", {}, "MultilineStringIsEmpty"),
            "stringsAreEqual": functionReference("this", {}, "StringsAreEqual"),
        })),
        "defaultInitializeValue": algorithm(functionReference("this", {}, "DefaultInitializeValue")),
    })
}