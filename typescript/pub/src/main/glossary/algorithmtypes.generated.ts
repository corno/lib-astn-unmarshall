import * as pt from 'pareto-core-types'

import { T } from "./datatypes.generated"

import * as g_common from "glo-pareto-common"
import * as g_h from "glo-astn-handlers"
import * as g_schema from "glo-astn-schema"
import * as g_th from "glo-astn-typedhandlers"

export namespace ASYNC {
    
    export namespace I {
        
        export type CreateUnmarshaller<GAnnotation, GSchemaAnnotation> = ($: T.CreateUnmarshallerData<GAnnotation, GSchemaAnnotation>, ) => g_h.ASYNC.I.RequiredValueHandler<T.Annotation<GAnnotation, GSchemaAnnotation>>
        
        export type DIV<GAnnotation, GSchemaAnnotation> = ($: g_schema.T.value<T.SchemaAnnotation<GAnnotation, GSchemaAnnotation>>, ) => void
        
        export type ErrorHandler<GAnnotation, GSchemaAnnotation> = {
            'data': ($: T.Error<GAnnotation, GSchemaAnnotation>, ) => void
            'end': () => void
        }
    }
    
    export namespace A {
        
        
        export namespace C {
            export type CreateUnmarshallerCreator<GAnnotation, GSchemaAnnotation> = {
                'construct': ($is: {
                    readonly 'errorHandler': ASYNC.I.ErrorHandler<GAnnotation, GSchemaAnnotation>
                    readonly 'handler': g_th.ASYNC.I.ValueHandler<T.Annotation<GAnnotation, GSchemaAnnotation>>
                }) => ASYNC.I.CreateUnmarshaller<GAnnotation, GSchemaAnnotation>
            }
        }
        
        
        export namespace C {
            export type DefaultInitializeValue<GAnnotation, GSchemaAnnotation> = {
                'construct': ($is: {
                    readonly 'handler': g_th.ASYNC.I.ValueHandler<T.Annotation<GAnnotation, GSchemaAnnotation>>
                }) => ASYNC.I.DIV<GAnnotation, GSchemaAnnotation>
            }
        }
    }
}

export namespace SYNC {
    
    export namespace A {
        
        
        export namespace F {
            export type CreateErrorMessage<GAnnotation, GSchemaAnnotation> = ($: T.ErrorType<GAnnotation, GSchemaAnnotation>) => g_common.T.String
        }
        
        
        export namespace F {
            export type MultilineStringIsEmpty<GAnnotation, GSchemaAnnotation> = ($: g_h.T.MultilineString<T.Annotation<GAnnotation, GSchemaAnnotation>>) => g_common.T.Boolean
        }
    }
}