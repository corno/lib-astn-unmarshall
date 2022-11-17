import * as tth from "api-astn-typedhandlers"

import * as h from "api-astn-handlers"

export type MixidIn<PAnnotation> = {
   readonly "pushGroup": (
        definition: tth.GroupDefinition,
        groupContainerHandler: tth.ITypedValueHandler<PAnnotation>
    ) => h.IValueHandler<PAnnotation>
    pushTaggedUnion: (
        definition: tth.OptionDefinition,
        taggedUnionHandler: tth.ITypedTaggedUnionHandler<PAnnotation>,
        optionHandler: tth.ITypedValueHandler<PAnnotation>,
    ) => void
}
