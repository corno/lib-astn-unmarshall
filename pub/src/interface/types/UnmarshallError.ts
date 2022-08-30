import { DiagnosticSeverity } from "./DiagnosticSeverity"

import * as pt from "pareto-core-types"

export type UnmarshallError =
    | ["array is not a list", {}]
    | ["array is not a shorthand group", {}]
    | ["duplicate key", {}]
    | ["expected a dictionary", {}]
    | ["expected a group", {}]
    | ["expected a list", {}]
    | ["expected a multiline string", {}]
    | ["expected an unquoted string", {}]
    | ["expected a quoted string", {}]
    | ["expected a tagged union", {}]
    | ["missing elements", {
        elements: pt.Dictionary<null>
    }]
    | ["missing option", {}]
    | ["entry key does not have quotes", {}]
    | ["property key does not have apostrophes", {}]
    | ["object is not a dictionary", {}]
    | ["object is not a verbose group", {}]
    | ["property has default value, remove", {}]
    | ["superfluous element", {}]
    | ["this is interpreted as an option, expected apostrophes", {}]
    | ["unknown option", {
        "known options": pt.Dictionary<null>
    }]
    | ["unknown property", {
        "known properties": pt.Dictionary<null>
    }]
    | ["value should have quotes instead of apostrophes", {}]
    | ["value should have quotes", {}]
    | ["value should not have apostrophes", {}]
    | ["value should not have quotes", {}];

export type AnnotatedUnmarshallError<Annotation> = {
    type: UnmarshallError,
    annotation: Annotation,
    severity: DiagnosticSeverity,
}