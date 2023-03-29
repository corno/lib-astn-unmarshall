import * as pd from 'pareto-core-data'

import { algorithm, constructor, dependent, sfunction } from "lib-pareto-typescript-project/dist/submodules/project/shorthands"

import * as g_project from "lib-pareto-typescript-project/dist/submodules/project"
const d = pd.d

export const $: g_project.T.ModuleDefinition.api.root<pd.SourceLocation> = {
    'algorithms': d({
        "createErrorMessage": algorithm(sfunction("this", {}, "CreateErrorMessage"), { "Annotation": "Annotation", "SchemaAnnotation": "SchemaAnnotation" }, dependent(null, {
            "getArrayAsString": sfunction("tostring", {}, "GetArrayAsString"),
            "getKeysAsString": sfunction("tostring", {}, "GetKeysAsString"),
            "getNumberOfKeysAsString": sfunction("tostring", {}, "GetNumberOfKeysAsString"),
            "getLengthAsString": sfunction("tostring", {}, "GetLengthAsString"),
        }, {})),
        "createUnmarshallerCreator": algorithm(constructor("this", {}, "CreateUnmarshallerCreator"), { "Annotation": "Annotation", "SchemaAnnotation": "SchemaAnnotation" }, dependent(null, {
            "multilineStringIsEmpty": sfunction("this", { "Annotation": "GAnnotation", "SchemaAnnotation": "GSchemaAnnotation" }, "MultilineStringIsEmpty"),
            "stringsAreEqual": sfunction("string", {}, "StringsAreEqual"),
        }, {})),
        "defaultInitializeValue": algorithm(constructor("this", {}, "DefaultInitializeValue"), { "Annotation": "Annotation", "SchemaAnnotation": "SchemaAnnotation" }),
    }),
}