import * as pt from 'pareto-core-types'

import { T } from './types.generated'

import * as g_common from "glo-pareto-common"
import * as g_h from "glo-astn-handlers"
import * as g_schema from "glo-astn-schema"
import * as g_th from "glo-astn-typedhandlers"

export namespace I {}

export namespace B {}

export namespace F {
    
    export type CreateUnmarshallErrorMessage = <GAnnotation>($: T.UnmarshallErrorType<GAnnotation>,) => g_common.T.String
    
    export type MultilineStringIsEmpty = <GAnnotation>($: g_h.T.MultilineString<T.Annotation<GAnnotation>>,) => g_common.T.Boolean
    
    export type StringsAreEqual = <GAnnotation>($: T.NestedStrings<GAnnotation>,) => g_common.T.Boolean
}