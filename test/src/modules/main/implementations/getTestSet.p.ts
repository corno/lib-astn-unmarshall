
import * as pm from "pareto-core-state"
import * as pl from "pareto-core-lib"


import * as api from "../api"

import * as pub from "../../../../../pub"

import * as mtest from "lib-pareto-test"

export const createGetTestset: api.CgetTestSet = () => {

    const builder = pm.createUnsafeDictionaryBuilder<mtest.TTestElement>()
    function createTest(name: string, actual: string, expected: string) {
        builder.add(name, {
            type: ["test", {
                type: ["short string", {
                    actual: actual,
                    expected: expected
                }]
            }]
        })
    }

    return pl.asyncValue({
        elements: builder.getDictionary()
    })
}