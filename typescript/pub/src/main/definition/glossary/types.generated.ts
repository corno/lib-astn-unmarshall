import * as pt from 'pareto-core-types'

import * as g_common from "glo-pareto-common"
import * as g_h from "glo-astn-handlers"
import * as g_schema from "glo-astn-schema"
import * as g_th from "glo-astn-typedhandlers"

export namespace T {
    
    export type Annotation<GAnnotation> = GAnnotation
    
    export namespace CreateUnmarshallerData {
        
        export type schema<GAnnotation> = g_schema.T.root
    }
    
    export type CreateUnmarshallerData<GAnnotation> = {
        readonly 'schema': g_schema.T.root
    }
    
    export namespace DiagnosticSeverity {
        
        export namespace error {}
        
        export type error<GAnnotation> = null
        
        export namespace warning {}
        
        export type warning<GAnnotation> = null
    }
    
    export type DiagnosticSeverity<GAnnotation> = 
        | ['error', null]
        | ['warning', null]
    
    export namespace NestedStrings {
        
        export type N<GAnnotation> = string
    }
    
    export type NestedStrings<GAnnotation> = pt.Nested<string>
    
    export namespace UnmarshallError {
        
        export type annotation<GAnnotation> = GAnnotation
        
        export type severity<GAnnotation> = T.DiagnosticSeverity<GAnnotation>
        
        export type _ltype<GAnnotation> = T.UnmarshallErrorType<GAnnotation>
    }
    
    export type UnmarshallError<GAnnotation> = {
        readonly 'annotation': GAnnotation
        readonly 'severity': T.DiagnosticSeverity<GAnnotation>
        readonly 'type': T.UnmarshallErrorType<GAnnotation>
    }
    
    export namespace UnmarshallErrorType {
        
        export namespace array__is__not__a__list {}
        
        export type array__is__not__a__list<GAnnotation> = null
        
        export namespace array__is__not__a__shorthand__group {}
        
        export type array__is__not__a__shorthand__group<GAnnotation> = null
        
        export namespace duplicate__key {}
        
        export type duplicate__key<GAnnotation> = null
        
        export namespace entry__key__does__not__have__quotes {}
        
        export type entry__key__does__not__have__quotes<GAnnotation> = null
        
        export namespace expected__a__dictionary {}
        
        export type expected__a__dictionary<GAnnotation> = null
        
        export namespace expected__a__group {}
        
        export type expected__a__group<GAnnotation> = null
        
        export namespace expected__a__list {}
        
        export type expected__a__list<GAnnotation> = null
        
        export namespace expected__a__multiline__string {}
        
        export type expected__a__multiline__string<GAnnotation> = null
        
        export namespace expected__a__quoted__string {}
        
        export type expected__a__quoted__string<GAnnotation> = null
        
        export namespace expected__a__tagged__union {}
        
        export type expected__a__tagged__union<GAnnotation> = null
        
        export namespace expected__an__unquoted__string {}
        
        export type expected__an__unquoted__string<GAnnotation> = null
        
        export namespace missing__elements {
            
            export namespace elements {
                
                export type A<GAnnotation> = string
            }
            
            export type elements<GAnnotation> = pt.Array<string>
        }
        
        export type missing__elements<GAnnotation> = {
            readonly 'elements': pt.Array<string>
        }
        
        export namespace missing__option {}
        
        export type missing__option<GAnnotation> = null
        
        export namespace object__is__not__a__dictionary {}
        
        export type object__is__not__a__dictionary<GAnnotation> = null
        
        export namespace object__is__not__a__verbose__group {}
        
        export type object__is__not__a__verbose__group<GAnnotation> = null
        
        export namespace property__has__default__value_cm__remove {}
        
        export type property__has__default__value_cm__remove<GAnnotation> = null
        
        export namespace property__key__does__not__have__apostrophes {}
        
        export type property__key__does__not__have__apostrophes<GAnnotation> = null
        
        export namespace superfluous__element {}
        
        export type superfluous__element<GAnnotation> = null
        
        export namespace this__is__interpreted__as__an__option_cm__expected__apostrophes {}
        
        export type this__is__interpreted__as__an__option_cm__expected__apostrophes<GAnnotation> = null
        
        export namespace unknown__option {
            
            export namespace known__options {
                
                export namespace D {}
                
                export type D<GAnnotation> = null
            }
            
            export type known__options<GAnnotation> = pt.Dictionary<null>
        }
        
        export type unknown__option<GAnnotation> = {
            readonly 'known options': pt.Dictionary<null>
        }
        
        export namespace unknown__property {
            
            export namespace known__properties {
                
                export namespace D {}
                
                export type D<GAnnotation> = null
            }
            
            export type known__properties<GAnnotation> = pt.Dictionary<null>
        }
        
        export type unknown__property<GAnnotation> = {
            readonly 'known properties': pt.Dictionary<null>
        }
        
        export namespace value__should__have__quotes {}
        
        export type value__should__have__quotes<GAnnotation> = null
        
        export namespace value__should__have__quotes__instead__of__apostrophes {}
        
        export type value__should__have__quotes__instead__of__apostrophes<GAnnotation> = null
        
        export namespace value__should__not__have__apostrophes {}
        
        export type value__should__not__have__apostrophes<GAnnotation> = null
        
        export namespace value__should__not__have__quotes {}
        
        export type value__should__not__have__quotes<GAnnotation> = null
    }
    
    export type UnmarshallErrorType<GAnnotation> = 
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
}