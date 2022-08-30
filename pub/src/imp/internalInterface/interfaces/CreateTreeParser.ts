// import { IContentTokenConsumer } from "astn-tokenconsumer-api";
// import { ITreeHandler } from "astn-handlers-api";

// // export type CreateTreeHandlerAndHandleErrorsParams<Annotation> = {
// //     handler: ITreeHandler<Annotation> | null
// //     onError: ($: {
// //         error: ParsingError
// //         annotation: Annotation
// //     }) => void
// // }

// // export type CreateTreeParserAndHandleErrors<Annotation> = (
// //     $p: CreateTreeHandlerAndHandleErrorsParams<Annotation>
// // ) => IContentTokenConsumer<Annotation>

// export type CreateTreeParser<Annotation> = (
//     handler: ITreeHandler<Annotation> | null,
// ) => IContentTokenConsumer<Annotation>