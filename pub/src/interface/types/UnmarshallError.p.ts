import { TDiagnosticSeverity } from "./DiagnosticSeverity.p"

import * as pt from 'pareto-core-types'

export type TUnmarshallError =
    | ["array is not a list", null]
    | ["array is not a shorthand group", null]
    | ["duplicate key", null]
    | ["expected a dictionary", null]
    | ["expected a group", null]
    | ["expected a list", null]
    | ["expected a multiline string", null]
    | ["expected an unquoted string", null]
    | ["expected a quoted string", null]
    | ["expected a tagged union", null]
    | ["missing elements", {
        readonly "elements": pt.Dictionary<null>
    }]
    | ["missing option", null]
    | ["entry key does not have quotes", null]
    | ["property key does not have apostrophes", null]
    | ["object is not a dictionary", null]
    | ["object is not a verbose group", null]
    | ["property has default value, remove", null]
    | ["superfluous element", null]
    | ["this is interpreted as an option, expected apostrophes", null]
    | ["unknown option", {
        "known options": pt.Dictionary<null>
    }]
    | ["unknown property", {
        "known properties": pt.Dictionary<null>
    }]
    | ["value should have quotes instead of apostrophes", null]
    | ["value should have quotes", null]
    | ["value should not have apostrophes", null]
    | ["value should not have quotes", null];

export type TAnnotatedUnmarshallError<PAnnotation> = {
    readonly "error": TUnmarshallError,
    readonly "annotation": PAnnotation,
    readonly "severity": TDiagnosticSeverity,
}