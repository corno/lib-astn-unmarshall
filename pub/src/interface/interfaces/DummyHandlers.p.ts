import * as th from "astn-handlers-api"

export type DummyHandlers<PAnnotation> = {
    array: () => th.IArrayHandler<PAnnotation>
    object: () => th.IObjectHandler<PAnnotation>
    taggedUnion: () => th.ITaggedUnionHandler<PAnnotation>
    requiredValue: () => th.IRequiredValueHandler<PAnnotation>
    value: () => th.IValueHandler<PAnnotation>
}