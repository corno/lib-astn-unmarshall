// import { IContentTokenConsumer } from "astn-tokenconsumer-api";
// import { ITreeHandler } from "astn-handlers-api";

// // export type CreateTreeHandlerAndHandleErrorsParams<PAnnotation> = {
// //     handler: ITreeHandler<PAnnotation> | null
// //     onError: ($: {
// //         error: ParsingError
// //         annotation: Annotation
// //     }) => void
// // }

// // export type CreateTreeParserAndHandleErrors<PAnnotation> = (
// //     $p: CreateTreeHandlerAndHandleErrorsParams<PAnnotation>
// // ) => IContentTokenConsumer<PAnnotation>

// export type CreateTreeParser<PAnnotation> = (
//     handler: ITreeHandler<PAnnotation> | null,
// ) => IContentTokenConsumer<PAnnotation>