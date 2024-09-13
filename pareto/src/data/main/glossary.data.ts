import * as pd from 'pareto-core-data'

import {
    aExternalInterfaceReference,
    aInterface,
    aInterfaceMethod,
    aInterfaceReference,
    array, constructor, data, dictionary, externalTypeReference, glossaryParameter, group, imp,
    member, ref, sfunction, streamconsumer, string, taggedUnion, type, typeReference
} from "lib-pareto-typescript-project/dist/submodules/glossary/shorthands"

import * as g_glossary from "lib-pareto-typescript-project/dist/submodules/glossary"

const d = pd.d

export const $: g_glossary.T.Glossary<pd.SourceLocation> = {
    'glossary parameters': d({
        "Annotation": null,
        "SchemaAnnotation": null,
    }),
    'imports': d({
        "common": imp(), //FIXME imp({}),
        "h": imp(), //FIXME imp({ "Annotation": typeReference("Annotation") }),
        "th": imp(), //FIXME imp({ "Annotation": typeReference("Annotation") }),
        "schema": imp(), //FIXME imp({ "Annotation": typeReference("SchemaAnnotation") }),
    }),
    'root': {
        'namespaces': d({}),
        'types': d({
            "Annotation": type(ref(glossaryParameter("Annotation"))),
            "SchemaAnnotation": type(ref(glossaryParameter("SchemaAnnotation"))),
            "DiagnosticSeverity": type(taggedUnion({
                "error": group({}),
                "warning": group({}),
            })),
            "ErrorType": type(taggedUnion({
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

            "Error": type(group({
                "type": member(ref(typeReference("ErrorType"))),
                "annotation": member(ref(glossaryParameter("Annotation"))),
                "severity": member(ref(typeReference("DiagnosticSeverity"))),
            })),
            // export type UnmarshallError<PAnnotation> = {
            //     type: UnmarshallErrorType,
            //     annotation: PAnnotation,
            //     severity: DiagnosticSeverity,
            // }
            "CreateUnmarshallerData": type(group({
                "schema": member(ref(externalTypeReference("schema", "Root"))),
            })),
            //FIXME "NestedStrings": type(nested(string())),
        }),
    },
    'asynchronous': {
        'interfaces': d({
            // "UnmarshallHandler": ['group', {
            //     'members': d({
            //         "handler": ['reference', parametrizedInterfaceReference("th", { "Annotation": typeReference("Annotation") }, "ValueHandler")],
            //         "onError": method(typeReference("UnmarshallError")),
            //     }),
            // }]
            "CreateUnmarshaller": aInterface(aInterfaceMethod(typeReference("CreateUnmarshallerData"), ['reference', aExternalInterfaceReference("h", "RequiredValueHandler")])),
            "ErrorHandler": aInterface(streamconsumer(
                aInterfaceMethod(typeReference("Error")),
                aInterfaceMethod(null)
            )),
            "DIV": aInterface(aInterfaceMethod(externalTypeReference("schema", "value"))),
        }),
        'algorithms': d({
            "CreateUnmarshallerCreator": constructor(aInterfaceReference("CreateUnmarshaller"), {
                "handler": aExternalInterfaceReference("th", "ValueHandler"),
                "errorHandler": aInterfaceReference("ErrorHandler")
            }),
            "DefaultInitializeValue": constructor(aInterfaceReference("DIV"), {
                "handler": aExternalInterfaceReference("th", "ValueHandler")
            }),

        }),
    },
    'synchronous': {
        'interfaces': d({}),
        'algorithms': d({
            "MultilineStringIsEmpty": sfunction(externalTypeReference("common", "Boolean"), data(externalTypeReference("h", "MultilineString"))),

            "CreateErrorMessage": sfunction(externalTypeReference("common", "String"), data(typeReference("ErrorType"))),
        }),
    },
}