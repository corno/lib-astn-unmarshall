import * as pr from 'pareto-core-raw'

import {
    null_,
    array,
    string,
    reference,
    boolean,
    typeReference,
    dictionary, group, member, taggedUnion, types, func, data, interfaceReference, inf, method, type, glossaryParameter
} from "lib-pareto-typescript-project/dist/submodules/glossary/shorthands.p"

import * as mglossary from "lib-pareto-typescript-project/dist/submodules/glossary"

const d = pr.wrapRawDictionary

export const $: mglossary.T.Glossary<string> = {
    'imports': d({
        "common": "glo-pareto-common",
    }),
    'parameters': d({
        "Annotation": {},
    }),
    'types': d({
        "DiagnosticSeverity": type(taggedUnion({
            "error": group({}),
            "warning": group({}),
        })),
        "UnmarshallErrorType": type(taggedUnion({
            "array is not a list": group({}),
            "array is not a shorthand group": group({}),
            "duplicate key": group({}),
            "expected a dictionary": group({}),
            "expected a group": group({}),
            "expected a list": group({}),
            "expected a multiline string": group({}),
            "expected an unquoted string": group({}),
            "expected a quoted string": group({}),
            "expected a tagged union": group({}),
            "missing elements": group({
                "elements": member(array(string())),
            }),
            "missing option": group({}),
            "entry key does not have quotes": group({}),
            "property key does not have apostrophes": group({}),
            "object is not a dictionary": group({}),
            "object is not a verbose group": group({}),
            "property has default value, remove": group({}),
            "superfluous element": group({}),
            "this is interpreted as an option, expected apostrophes": group({}),
            "unknown option": group({
                "known options": member(dictionary(group({}))),
            }),
            "unknown property": group({
                "known properties": member(dictionary(group({}))),
            }),
            "value should have quotes instead of apostrophes": group({}),
            "value should have quotes": group({}),
            "value should not have apostrophes": group({}),
            "value should not have quotes": group({}),
        })),

        "UnmarshallError": type(group({
            "type": member(reference("UnmarshallErrorType")),
            "annotation": member(glossaryParameter("Annotation")),
            "severity": member(reference("DiagnosticSeverity")),
        })),


        // export type UnmarshallError<PAnnotation> = {
        //     type: UnmarshallErrorType,
        //     annotation: PAnnotation,
        //     severity: DiagnosticSeverity,
        // }


    }),
    'interfaces': d({
    }),
    'functions': d({
        "CreateUnmarshallErrorMessage": func(typeReference("UnmarshallErrorType"), null, null, data(typeReference("common", "String"), false))
    }),
}