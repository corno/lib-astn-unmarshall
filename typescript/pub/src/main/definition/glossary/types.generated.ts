import * as pt from 'pareto-core-types'

import * as gcommon from "glo-pareto-common"
import * as gh from "glo-astn-handlers"
import * as gschema from "glo-astn-schema"
import * as gth from "glo-astn-typedhandlers"

export namespace T {
    
    export type Annotation<GPAnnotation> = GPAnnotation
    
    export namespace CreateUnmarshallerData {
        
        export type schema<GPAnnotation> = gschema.T.root
    }
    
    export type CreateUnmarshallerData<GPAnnotation> = {
        readonly 'schema': gschema.T.root
    }
    
    export namespace DiagnosticSeverity {
        
        export namespace error {}
        
        export type error<GPAnnotation> = null
        
        export namespace warning {}
        
        export type warning<GPAnnotation> = null
    }
    
    export type DiagnosticSeverity<GPAnnotation> = 
        | ['error', null]
        | ['warning', null]
    
    export namespace NestedStrings {
        
        export type N<GPAnnotation> = string
    }
    
    export type NestedStrings<GPAnnotation> = pt.Nested<string>
    
    export namespace UnmarshallError {
        
        export type annotation<GPAnnotation> = GPAnnotation
        
        export type severity<GPAnnotation> = T.DiagnosticSeverity<GPAnnotation>
        
        export type _ltype<GPAnnotation> = T.UnmarshallErrorType<GPAnnotation>
    }
    
    export type UnmarshallError<GPAnnotation> = {
        readonly 'annotation': GPAnnotation
        readonly 'severity': T.DiagnosticSeverity<GPAnnotation>
        readonly 'type': T.UnmarshallErrorType<GPAnnotation>
    }
    
    export namespace UnmarshallErrorType {
        
        export namespace array__is__not__a__list {}
        
        export type array__is__not__a__list<GPAnnotation> = null
        
        export namespace array__is__not__a__shorthand__group {}
        
        export type array__is__not__a__shorthand__group<GPAnnotation> = null
        
        export namespace duplicate__key {}
        
        export type duplicate__key<GPAnnotation> = null
        
        export namespace entry__key__does__not__have__quotes {}
        
        export type entry__key__does__not__have__quotes<GPAnnotation> = null
        
        export namespace expected__a__dictionary {}
        
        export type expected__a__dictionary<GPAnnotation> = null
        
        export namespace expected__a__group {}
        
        export type expected__a__group<GPAnnotation> = null
        
        export namespace expected__a__list {}
        
        export type expected__a__list<GPAnnotation> = null
        
        export namespace expected__a__multiline__string {}
        
        export type expected__a__multiline__string<GPAnnotation> = null
        
        export namespace expected__a__quoted__string {}
        
        export type expected__a__quoted__string<GPAnnotation> = null
        
        export namespace expected__a__tagged__union {}
        
        export type expected__a__tagged__union<GPAnnotation> = null
        
        export namespace expected__an__unquoted__string {}
        
        export type expected__an__unquoted__string<GPAnnotation> = null
        
        export namespace missing__elements {
            
            export namespace elements {
                
                export type A<GPAnnotation> = string
            }
            
            export type elements<GPAnnotation> = pt.Array<string>
        }
        
        export type missing__elements<GPAnnotation> = {
            readonly 'elements': pt.Array<string>
        }
        
        export namespace missing__option {}
        
        export type missing__option<GPAnnotation> = null
        
        export namespace object__is__not__a__dictionary {}
        
        export type object__is__not__a__dictionary<GPAnnotation> = null
        
        export namespace object__is__not__a__verbose__group {}
        
        export type object__is__not__a__verbose__group<GPAnnotation> = null
        
        export namespace property__has__default__value_cm__remove {}
        
        export type property__has__default__value_cm__remove<GPAnnotation> = null
        
        export namespace property__key__does__not__have__apostrophes {}
        
        export type property__key__does__not__have__apostrophes<GPAnnotation> = null
        
        export namespace superfluous__element {}
        
        export type superfluous__element<GPAnnotation> = null
        
        export namespace this__is__interpreted__as__an__option_cm__expected__apostrophes {}
        
        export type this__is__interpreted__as__an__option_cm__expected__apostrophes<GPAnnotation> = null
        
        export namespace unknown__option {
            
            export namespace known__options {
                
                export namespace D {}
                
                export type D<GPAnnotation> = null
            }
            
            export type known__options<GPAnnotation> = pt.Dictionary<null>
        }
        
        export type unknown__option<GPAnnotation> = {
            readonly 'known options': pt.Dictionary<null>
        }
        
        export namespace unknown__property {
            
            export namespace known__properties {
                
                export namespace D {}
                
                export type D<GPAnnotation> = null
            }
            
            export type known__properties<GPAnnotation> = pt.Dictionary<null>
        }
        
        export type unknown__property<GPAnnotation> = {
            readonly 'known properties': pt.Dictionary<null>
        }
        
        export namespace value__should__have__quotes {}
        
        export type value__should__have__quotes<GPAnnotation> = null
        
        export namespace value__should__have__quotes__instead__of__apostrophes {}
        
        export type value__should__have__quotes__instead__of__apostrophes<GPAnnotation> = null
        
        export namespace value__should__not__have__apostrophes {}
        
        export type value__should__not__have__apostrophes<GPAnnotation> = null
        
        export namespace value__should__not__have__quotes {}
        
        export type value__should__not__have__quotes<GPAnnotation> = null
    }
    
    export type UnmarshallErrorType<GPAnnotation> = 
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