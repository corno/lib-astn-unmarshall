// import * as grammar from "astn-handlers-api";

// import * as typedTokenize from "astn-typedhandlers-api";
// import { DiagnosticSeverity } from "astn-unmarshall-api";
// import { InternalSchemaSpecification } from "../types/InternalSchemaSpecification";
// import { UnmarshallError } from "astn-unmarshall-api";

// export type CreateTreeUnmarshaller2<PAnnotation> = ($: {
//     specification: InternalSchemaSpecification
//     schemaAndSideEffects: typedTokenize.ISchemaAndSideEffects<PAnnotation>
//     onError: (
//         message: UnmarshallError,
//         annotation: PAnnotation,
//         severity: DiagnosticSeverity
//     ) => void
// }) => grammar.ITreeHandler<PAnnotation>