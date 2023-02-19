import * as pd from 'pareto-core-data'

import {
    null_,
    array,
    string,
    reference,
    boolean,
    typeReference,
    dictionary, group, member, taggedUnion, types, func, data, interfaceReference, inf, method, type, glossaryParameter, parametrizedInterfaceReference, parametrizedTypeReference, nested
} from "lib-pareto-typescript-project/dist/submodules/glossary/shorthands"

import * as mglossary from "lib-pareto-typescript-project/dist/submodules/glossary"

const d = pd.d

export const $: mglossary.T.Glossary<string> = {
    'imports': d({
        "common": "glo-pareto-common",
        "h": "glo-astn-handlers",
        "th": "glo-astn-typedhandlers",
        "schema": "glo-astn-schema",
    }),
    'parameters': d({
        "Annotation": {},
    }),
    'types': d({
        "Annotation": type(glossaryParameter("Annotation")),
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
        "CreateUnmarshallerData": type(group({
            "schema": member(reference("schema", "root")),
        })),
        "NestedStrings": type(nested(string()))

    }),
    'interfaces': d({
        "UnmarshallHandler": ['group', {
            'members': d({
                "handler": ['reference', parametrizedInterfaceReference("th", { "Annotation": typeReference("Annotation") }, "ValueHandler")],
                "onError": method(typeReference("UnmarshallError")),
            }),
        }]
    }),
    'functions': d({
        "MultilineStringIsEmpty": func(parametrizedTypeReference("h", { "Annotation": typeReference("Annotation") }, "MultilineString"), null, null, data(typeReference("common", "Boolean"), false)),
        "StringsAreEqual": func(typeReference("NestedStrings"), null, null, data(typeReference("common", "Boolean"), false)),
        "CreateUnmarshaller": func(typeReference("CreateUnmarshallerData"), null, interfaceReference("UnmarshallHandler"), inf(parametrizedInterfaceReference("h", { "Annotation": typeReference("Annotation") }, "RequiredValueHandler"))),
        "CreateUnmarshallErrorMessage": func(typeReference("UnmarshallErrorType"), null, null, data(typeReference("common", "String"), false)),
        "DefaultInitializeValue": func(typeReference("schema", "value"), null, parametrizedInterfaceReference("th", { "Annotation": typeReference("Annotation") }, "ValueHandler"), null),
    }),
}