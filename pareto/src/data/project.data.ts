import * as pr from 'pareto-core-raw'

import * as mproject from "lib-pareto-typescript-project/dist/submodules/project"

const d = pr.wrapRawDictionary

import { $ as api } from "./api.data"

export const $: mproject.T.Project = {
    'author': "Corno",
    'description': "unmarshall an ASTN Document (string) into a *typed* dataset",
    'license': "ISC",

    'pubdependencies': d({
        "res-pareto-tostring": {},
        "glo-astn-handlers": {},
        //"glo-astn-typedhandlers": {},
    }),
    'type': ['library', {
        'main': {
            'definition': api,
        },
        'submodules': d({
        }),
        'executables': d({}),
        'test': {
            'dependencies': d({
            }),
        }
    }],
}