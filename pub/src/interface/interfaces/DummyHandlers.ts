import * as th from "astn-handlers-api"

export type DummyHandlers<Annotation> = {
    array: () => th.IArrayHandler<Annotation>
    object: () => th.IObjectHandler<Annotation>
    taggedUnion: () => th.ITaggedUnionHandler<Annotation>
    requiredValue: () => th.IRequiredValueHandler<Annotation>
    value: () => th.IValueHandler<Annotation>
}