import * as pt from 'pareto-core-types'

import * as g_string from "../submodules/string"
import * as g_this from "./glossary"
import * as g_tostring from "res-pareto-tostring"

export namespace D {
    
    export type createErrorMessage<GAnnotation, GSchemaAnnotation> = {
        readonly 'getArrayAsString': g_tostring.SYNC.A.F.GetArrayAsString
        readonly 'getKeysAsString': g_tostring.SYNC.A.F.GetKeysAsString
        readonly 'getLengthAsString': g_tostring.SYNC.A.F.GetLengthAsString
        readonly 'getNumberOfKeysAsString': g_tostring.SYNC.A.F.GetNumberOfKeysAsString
    }
    
    export type createUnmarshallerCreator<GAnnotation, GSchemaAnnotation> = {
        readonly 'multilineStringIsEmpty': g_this.SYNC.A.F.MultilineStringIsEmpty<GAnnotation, GSchemaAnnotation>
        readonly 'stringsAreEqual': g_string.SYNC.A.F.StringsAreEqual
    }
    
}

export namespace A {
    
    export type createErrorMessage = <GAnnotation, GSchemaAnnotation>($d: D.createErrorMessage<GAnnotation, GSchemaAnnotation>, ) => g_this.SYNC.A.F.CreateErrorMessage<GAnnotation, GSchemaAnnotation>
    
    export type createUnmarshallerCreator = <GAnnotation, GSchemaAnnotation>($d: D.createUnmarshallerCreator<GAnnotation, GSchemaAnnotation>, ) => g_this.ASYNC.A.C.CreateUnmarshallerCreator<GAnnotation, GSchemaAnnotation>
    
    export type defaultInitializeValue = <GAnnotation, GSchemaAnnotation>() => g_this.ASYNC.A.C.DefaultInitializeValue<GAnnotation, GSchemaAnnotation>
}

export type API = {
    readonly 'createErrorMessage': A.createErrorMessage
    readonly 'createUnmarshallerCreator': A.createUnmarshallerCreator
    readonly 'defaultInitializeValue': A.defaultInitializeValue
}