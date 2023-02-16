import * as mth from "glo-astn-typedhandlers"
import * as mschema from "glo-astn-schema"

import * as mh from "glo-astn-handlers"

export type MixidIn<PAnnotation> = {
   readonly "pushGroup": (
        definition: mschema.T.group,
        groupContainerHandler: mth.IValueHandler<PAnnotation>
    ) => mh.IValueHandler<PAnnotation>
    pushTaggedUnion: (
        definition: mschema.T.options,
        taggedUnionHandler: mth.ITaggedUnionHandler<PAnnotation>,
        optionHandler: mth.IValueHandler<PAnnotation>,
    ) => void
}
