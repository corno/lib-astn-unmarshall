import * as pd from 'pareto-core-data'

import { external, sibling, this_ } from "lib-pareto-typescript-project/dist/submodules/project/shorthands"

import * as gproject from "lib-pareto-typescript-project/dist/submodules/project"

import { $ as api } from "./api.data"
import { $ as glossary } from "./glossary.data"

const d = pd.d

export const $: gproject.T.Project._ltype.library.main<pd.SourceLocation> = {
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
                "string": external("res-pareto-string"),
                "this": this_(),
            }),
        }
    },
    'implementation': ['typescript', null],
}