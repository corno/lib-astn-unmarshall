import * as pd from 'pareto-core-data'

import * as mproject from "lib-pareto-typescript-project/dist/submodules/project"

const d = pd.d

import { $ as api } from "./api.data"

export const $: mproject.T.Project<pd.SourceLocation> = {
    'author': "Corno",
    'description': "unmarshall an ASTN Document (string) into a *typed* dataset",
    'license': "TBD",

    'dependencies': d({
        "res-pareto-string": {},
        "res-pareto-tostring": {},
        "glo-astn-handlers": {},
        "glo-astn-schema": {},
        "glo-astn-typedhandlers": {},
    }),
    'type': ['library', {
        'main': {
            'definition': api,
            'implementation': ['manual', {}],
        },
        'submodules': d({
        }),
        'executables': d({}),
        'test': {
            'dependencies': d({
            }),
            'glossary': {
                'functions': d({}),
                'imports': d({}),
                'parameters': d({}),
                'types': d({}),
                'interfaces': d({}),
            },
        }
    }],
}