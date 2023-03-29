import * as pt from 'pareto-core-types'

import * as g_common from "glo-pareto-common"
import * as g_h from "glo-astn-handlers"
import * as g_schema from "glo-astn-schema"
import * as g_th from "glo-astn-typedhandlers"

export namespace N {}

export namespace T {
    
    export type Annotation<GAnnotation, GSchemaAnnotation> = GAnnotation
    
    export namespace CreateUnmarshallerData {
        
        export type schema<GAnnotation, GSchemaAnnotation> = g_schema.T.Root<T.SchemaAnnotation<GAnnotation, GSchemaAnnotation>>
    }
    
    export type CreateUnmarshallerData<GAnnotation, GSchemaAnnotation> = {
        readonly 'schema': g_schema.T.Root<T.SchemaAnnotation<GAnnotation, GSchemaAnnotation>>
    }
    
    export namespace DiagnosticSeverity {
        
        export namespace error {}
        
        export type error<GAnnotation, GSchemaAnnotation> = null
        
        export namespace warning {}
        
        export type warning<GAnnotation, GSchemaAnnotation> = null
    }
    
    export type DiagnosticSeverity<GAnnotation, GSchemaAnnotation> = 
        | ['error', null]
        | ['warning', null]
    
    export namespace Error {
        
        export type annotation<GAnnotation, GSchemaAnnotation> = GAnnotation
        
        export type severity<GAnnotation, GSchemaAnnotation> = T.DiagnosticSeverity<GAnnotation, GSchemaAnnotation>
        
        export type _ltype<GAnnotation, GSchemaAnnotation> = T.ErrorType<GAnnotation, GSchemaAnnotation>
    }
    
    export type Error<GAnnotation, GSchemaAnnotation> = {
        readonly 'annotation': GAnnotation
        readonly 'severity': T.DiagnosticSeverity<GAnnotation, GSchemaAnnotation>
        readonly 'type': T.ErrorType<GAnnotation, GSchemaAnnotation>
    }
    
    export namespace ErrorType {
        
        export namespace array__is__not__a__list {}
        
        export type array__is__not__a__list<GAnnotation, GSchemaAnnotation> = null
        
        export namespace array__is__not__a__shorthand__group {}
        
        export type array__is__not__a__shorthand__group<GAnnotation, GSchemaAnnotation> = null
        
        export namespace duplicate__key {}
        
        export type duplicate__key<GAnnotation, GSchemaAnnotation> = null
        
        export namespace entry__key__does__not__have__quotes {}
        
        export type entry__key__does__not__have__quotes<GAnnotation, GSchemaAnnotation> = null
        
        export namespace expected__a__dictionary {}
        
        export type expected__a__dictionary<GAnnotation, GSchemaAnnotation> = null
        
        export namespace expected__a__group {}
        
        export type expected__a__group<GAnnotation, GSchemaAnnotation> = null
        
        export namespace expected__a__list {}
        
        export type expected__a__list<GAnnotation, GSchemaAnnotation> = null
        
        export namespace expected__a__multiline__string {}
        
        export type expected__a__multiline__string<GAnnotation, GSchemaAnnotation> = null
        
        export namespace expected__a__quoted__string {}
        
        export type expected__a__quoted__string<GAnnotation, GSchemaAnnotation> = null
        
        export namespace expected__a__tagged__union {}
        
        export type expected__a__tagged__union<GAnnotation, GSchemaAnnotation> = null
        
        export namespace expected__an__unquoted__string {}
        
        export type expected__an__unquoted__string<GAnnotation, GSchemaAnnotation> = null
        
        export namespace missing__elements {
            
            export namespace elements {
                
                export type A<GAnnotation, GSchemaAnnotation> = string
            }
            
            export type elements<GAnnotation, GSchemaAnnotation> = pt.Array<string>
        }
        
        export type missing__elements<GAnnotation, GSchemaAnnotation> = {
            readonly 'elements': pt.Array<string>
        }
        
        export namespace missing__option {}
        
        export type missing__option<GAnnotation, GSchemaAnnotation> = null
        
        export namespace object__is__not__a__dictionary {}
        
        export type object__is__not__a__dictionary<GAnnotation, GSchemaAnnotation> = null
        
        export namespace object__is__not__a__verbose__group {}
        
        export type object__is__not__a__verbose__group<GAnnotation, GSchemaAnnotation> = null
        
        export namespace property__has__default__value_cm__remove {}
        
        export type property__has__default__value_cm__remove<GAnnotation, GSchemaAnnotation> = null
        
        export namespace property__key__does__not__have__apostrophes {}
        
        export type property__key__does__not__have__apostrophes<GAnnotation, GSchemaAnnotation> = null
        
        export namespace superfluous__element {}
        
        export type superfluous__element<GAnnotation, GSchemaAnnotation> = null
        
        export namespace this__is__interpreted__as__an__option_cm__expected__apostrophes {}
        
        export type this__is__interpreted__as__an__option_cm__expected__apostrophes<GAnnotation, GSchemaAnnotation> = null
        
        export namespace unknown__option {
            
            export namespace known__options {
                
                export namespace D {}
                
                export type D<GAnnotation, GSchemaAnnotation> = null
            }
            
            export type known__options<GAnnotation, GSchemaAnnotation> = pt.Dictionary<null>
        }
        
        export type unknown__option<GAnnotation, GSchemaAnnotation> = {
            readonly 'known options': pt.Dictionary<null>
        }
        
        export namespace unknown__property {
            
            export namespace known__properties {
                
                export namespace D {}
                
                export type D<GAnnotation, GSchemaAnnotation> = null
            }
            
            export type known__properties<GAnnotation, GSchemaAnnotation> = pt.Dictionary<null>
        }
        
        export type unknown__property<GAnnotation, GSchemaAnnotation> = {
            readonly 'known properties': pt.Dictionary<null>
        }
        
        export namespace value__should__have__quotes {}
        
        export type value__should__have__quotes<GAnnotation, GSchemaAnnotation> = null
        
        export namespace value__should__have__quotes__instead__of__apostrophes {}
        
        export type value__should__have__quotes__instead__of__apostrophes<GAnnotation, GSchemaAnnotation> = null
        
        export namespace value__should__not__have__apostrophes {}
        
        export type value__should__not__have__apostrophes<GAnnotation, GSchemaAnnotation> = null
        
        export namespace value__should__not__have__quotes {}
        
        export type value__should__not__have__quotes<GAnnotation, GSchemaAnnotation> = null
    }
    
    export type ErrorType<GAnnotation, GSchemaAnnotation> = 
        | ['array is not a list', null]
        | ['array is not a shorthand group', null]
        | ['duplicate key', null]
        | ['entry key does not have quotes', null]
        | ['expected a dictionary', null]
        | ['expected a group', null]
        | ['expected a list', null]
        | ['expected a multiline string', null]
        | ['expected a quoted string', null]
        | ['expected a tagged union', null]
        | ['expected an unquoted string', null]
        | ['missing elements', {
            readonly 'elements': pt.Array<string>
        }]
        | ['missing option', null]
        | ['object is not a dictionary', null]
        | ['object is not a verbose group', null]
        | ['property has default value, remove', null]
        | ['property key does not have apostrophes', null]
        | ['superfluous element', null]
        | ['this is interpreted as an option, expected apostrophes', null]
        | ['unknown option', {
            readonly 'known options': pt.Dictionary<null>
        }]
        | ['unknown property', {
            readonly 'known properties': pt.Dictionary<null>
        }]
        | ['value should have quotes', null]
        | ['value should have quotes instead of apostrophes', null]
        | ['value should not have apostrophes', null]
        | ['value should not have quotes', null]
    
    export namespace NestedStrings {
        
        export type N<GAnnotation, GSchemaAnnotation> = string
    }
    
    export type NestedStrings<GAnnotation, GSchemaAnnotation> = pt.Nested<string>
    
    export type SchemaAnnotation<GAnnotation, GSchemaAnnotation> = GSchemaAnnotation
}