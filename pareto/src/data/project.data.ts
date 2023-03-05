import * as pd from 'pareto-core-data'

import * as mproject from "lib-pareto-typescript-project/dist/submodules/project"

const d = pd.d

import { $ as main } from "./main/module.data"

export const $: mproject.T.Project<pd.SourceLocation> = {
    'author': "Corno",
    'description': "unmarshall an ASTN Document (string) into a *typed* dataset",
    'license': "TBD",

    'dependencies': d({
        "res-pareto-string": null,
        "res-pareto-tostring": null,
        "glo-astn-handlers": null,
        "glo-astn-schema": null,
        "glo-astn-typedhandlers": null,
    }),
    'type': ['library', {
        'main': main,
        'submodules': d({
        }),
        'executables': d({}),
        'test': {
            'dependencies': d({
            }),
            'glossary': {
                'parameters': d({}),
                'types': d({}),
                'builders': d({}),
                'interfaces': d({}),
                'functions': d({}),
            },
            'imports': d({}),
        }
    }],
}