import * as pd from 'pareto-core-data'

import {
    array, data, dictionary, externalTypeReference, glossaryParameter, group, imp, member, ref, sfunction, string, taggedUnion, type, typeReference
} from "lib-pareto-typescript-project/dist/submodules/glossary/shorthands"

import * as g_glossary from "lib-pareto-typescript-project/dist/submodules/glossary"

const d = pd.d

export const $: g_glossary.T.Glossary<pd.SourceLocation> = {
    'glossary parameters': d({
    }),
    'imports': d({
        "common": imp(),
    }),
    'root': {
        'namespaces': d({}),
        'types': d({

            //FIX should nested be reintroduced??? "NestedStrings": type(nested(string())),

        }),
    },
    'asynchronous': {
        'interfaces': d({
        }),
        'algorithms': d({}),
    },
    'synchronous': {
        'interfaces': d({}),
        'algorithms': d({
            "StringsAreEqual": sfunction(externalTypeReference("common", "Boolean"), data(typeReference("NestedStrings"))),
        }),
    },
}