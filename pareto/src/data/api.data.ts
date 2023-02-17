import * as pd from 'pareto-core-data'

import {
    null_,
    array,
    string,
    reference,
    boolean,
    nested,
    typeReference,
    dictionary, group, member, taggedUnion, types, func, data
} from "lib-pareto-typescript-project/dist/submodules/glossary/shorthands.p"

import { definitionReference, constructor, algorithm } from "lib-pareto-typescript-project/dist/submodules/moduleDefinition/shorthands.p"

import * as mmoduleDefinition from "lib-pareto-typescript-project/dist/submodules/moduleDefinition"

import { $ as glossary } from "./glossary.data"

const d = pd.wrapRawDictionary

export const $: mmoduleDefinition.T.ModuleDefinition = {
    'glossary': glossary,
    'api': {
        'imports': d({
            //"common": "glo-pareto-common",
            "tostring": "res-pareto-tostring",
            "string": "res-pareto-string",
        }),
        'algorithms': d({
            "createErrorMessage": algorithm(definitionReference("CreateUnmarshallErrorMessage"), constructor(null, {
                "getArrayAsString": definitionReference("tostring", {}, "GetArrayAsString"),
                "getKeysAsString": definitionReference("tostring", {}, "GetKeysAsString"),
                "getNumberOfKeysAsString": definitionReference("tostring", {}, "GetNumberOfKeysAsString"),
                "getLengthAsString": definitionReference("tostring", {}, "GetLengthAsString"),
            })),
            "createUnmarshaller": algorithm(definitionReference("CreateUnmarshaller"), constructor(null, {
                "multilineStringIsEmpty": definitionReference("MultilineStringIsEmpty"),
                "stringsAreEqual": definitionReference("StringsAreEqual"),
            })),
            "defaultInitializeValue": algorithm(definitionReference("DefaultInitializeValue")),
        })
    },
}
