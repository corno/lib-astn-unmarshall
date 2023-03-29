import * as pt from 'pareto-core-types'

import * as g_common from "glo-pareto-common"

export namespace N {}

export namespace T {
    
    export namespace NestedStrings {
        
        export type N = string
    }
    
    export type NestedStrings = pt.Nested<string>
}