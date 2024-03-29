import * as pd from 'pareto-core-data'

import { external, sibling, submodule, this_ } from "lib-pareto-typescript-project/dist/submodules/project/shorthands"

import * as g_project from "lib-pareto-typescript-project/dist/submodules/project"

import { $ as api } from "./api.data"
import { $ as glossary } from "./glossary.data"

const d = pd.d

export const $: g_project.T.Module<pd.SourceLocation> = {
    'definition': {
        'glossary': {
            'root': glossary,
            'imports': d({
                "common": external("glo-pareto-common"),
                "h": external("glo-astn-handlers"),
                "th": external("glo-astn-typedhandlers"),
                "schema": external("glo-astn-schema"),
            }),
        },
        'api': {
            'root': api,
            'imports': d({
                //"common": "glo-pareto-common",
                "tostring":external( "res-pareto-tostring"),
                "string": submodule("string"),
                "this": this_(),
            }),
        }
    },
    'implementation': ['typescript', null],
}