// import * as grammar from "astn-handlers-api";

// import * as typedTokenize from "astn-typedhandlers-api";
// import { DiagnosticSeverity } from "astn-unmarshall-api";
// import { InternalSchemaSpecification } from "../types/InternalSchemaSpecification";
// import { UnmarshallError } from "astn-unmarshall-api";

// export type CreateTreeUnmarshaller2<Annotation> = ($: {
//     specification: InternalSchemaSpecification
//     schemaAndSideEffects: typedTokenize.ISchemaAndSideEffects<Annotation>
//     onError: (
//         message: UnmarshallError,
//         annotation: Annotation,
//         severity: DiagnosticSeverity
//     ) => void
// }) => grammar.ITreeHandler<Annotation>