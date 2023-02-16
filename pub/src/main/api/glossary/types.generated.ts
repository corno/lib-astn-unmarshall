import * as pt from 'pareto-core-types'

import * as mcommon from "glo-pareto-common"
import * as mh from "glo-astn-handlers"
import * as mschema from "glo-astn-schema"
import * as mth from "glo-astn-typedhandlers"

export namespace T {
    
    export type Annotation<GPAnnotation> = GPAnnotation
    
    export namespace CreateUnmarshallerData {
        
        export type schema<GPAnnotation> = mschema.T.root
    }
    
    export type CreateUnmarshallerData<GPAnnotation> = {
        readonly 'schema': mschema.T.root
    }
    
    export namespace DiagnosticSeverity {
        
        export namespace error {}
        
        export type error<GPAnnotation> = {}
        
        export namespace warning {}
        
        export type warning<GPAnnotation> = {}
    }
    
    export type DiagnosticSeverity<GPAnnotation> = 
        | ['error', {}]
        | ['warning', {}]
    
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
        
        export type array__is__not__a__list<GPAnnotation> = {}
        
        export namespace array__is__not__a__shorthand__group {}
        
        export type array__is__not__a__shorthand__group<GPAnnotation> = {}
        
        export namespace duplicate__key {}
        
        export type duplicate__key<GPAnnotation> = {}
        
        export namespace entry__key__does__not__have__quotes {}
        
        export type entry__key__does__not__have__quotes<GPAnnotation> = {}
        
        export namespace expected__a__dictionary {}
        
        export type expected__a__dictionary<GPAnnotation> = {}
        
        export namespace expected__a__group {}
        
        export type expected__a__group<GPAnnotation> = {}
        
        export namespace expected__a__list {}
        
        export type expected__a__list<GPAnnotation> = {}
        
        export namespace expected__a__multiline__string {}
        
        export type expected__a__multiline__string<GPAnnotation> = {}
        
        export namespace expected__a__quoted__string {}
        
        export type expected__a__quoted__string<GPAnnotation> = {}
        
        export namespace expected__a__tagged__union {}
        
        export type expected__a__tagged__union<GPAnnotation> = {}
        
        export namespace expected__an__unquoted__string {}
        
        export type expected__an__unquoted__string<GPAnnotation> = {}
        
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
        
        export type missing__option<GPAnnotation> = {}
        
        export namespace object__is__not__a__dictionary {}
        
        export type object__is__not__a__dictionary<GPAnnotation> = {}
        
        export namespace object__is__not__a__verbose__group {}
        
        export type object__is__not__a__verbose__group<GPAnnotation> = {}
        
        export namespace property__has__default__value_cm__remove {}
        
        export type property__has__default__value_cm__remove<GPAnnotation> = {}
        
        export namespace property__key__does__not__have__apostrophes {}
        
        export type property__key__does__not__have__apostrophes<GPAnnotation> = {}
        
        export namespace superfluous__element {}
        
        export type superfluous__element<GPAnnotation> = {}
        
        export namespace this__is__interpreted__as__an__option_cm__expected__apostrophes {}
        
        export type this__is__interpreted__as__an__option_cm__expected__apostrophes<GPAnnotation> = {}
        
        export namespace unknown__option {
            
            export namespace known__options {
                
                export namespace D {}
                
                export type D<GPAnnotation> = {}
            }
            
            export type known__options<GPAnnotation> = pt.Dictionary<{}>
        }
        
        export type unknown__option<GPAnnotation> = {
            readonly 'known options': pt.Dictionary<{}>
        }
        
        export namespace unknown__property {
            
            export namespace known__properties {
                
                export namespace D {}
                
                export type D<GPAnnotation> = {}
            }
            
            export type known__properties<GPAnnotation> = pt.Dictionary<{}>
        }
        
        export type unknown__property<GPAnnotation> = {
            readonly 'known properties': pt.Dictionary<{}>
        }
        
        export namespace value__should__have__quotes {}
        
        export type value__should__have__quotes<GPAnnotation> = {}
        
        export namespace value__should__have__quotes__instead__of__apostrophes {}
        
        export type value__should__have__quotes__instead__of__apostrophes<GPAnnotation> = {}
        
        export namespace value__should__not__have__apostrophes {}
        
        export type value__should__not__have__apostrophes<GPAnnotation> = {}
        
        export namespace value__should__not__have__quotes {}
        
        export type value__should__not__have__quotes<GPAnnotation> = {}
    }
    
    export type UnmarshallErrorType<GPAnnotation> = 
        | ['array is not a list', {}]
        | ['array is not a shorthand group', {}]
        | ['duplicate key', {}]
        | ['entry key does not have quotes', {}]
        | ['expected a dictionary', {}]
        | ['expected a group', {}]
        | ['expected a list', {}]
        | ['expected a multiline string', {}]
        | ['expected a quoted string', {}]
        | ['expected a tagged union', {}]
        | ['expected an unquoted string', {}]
        | ['missing elements', {
            readonly 'elements': pt.Array<string>
        }]
        | ['missing option', {}]
        | ['object is not a dictionary', {}]
        | ['object is not a verbose group', {}]
        | ['property has default value, remove', {}]
        | ['property key does not have apostrophes', {}]
        | ['superfluous element', {}]
        | ['this is interpreted as an option, expected apostrophes', {}]
        | ['unknown option', {
            readonly 'known options': pt.Dictionary<{}>
        }]
        | ['unknown property', {
            readonly 'known properties': pt.Dictionary<{}>
        }]
        | ['value should have quotes', {}]
        | ['value should have quotes instead of apostrophes', {}]
        | ['value should not have apostrophes', {}]
        | ['value should not have quotes', {}]
}