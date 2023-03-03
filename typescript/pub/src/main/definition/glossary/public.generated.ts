import * as pt from 'pareto-core-types'

import { T   } from './types.generated'

import * as gcommon from "glo-pareto-common"
import * as gh from "glo-astn-handlers"
import * as gschema from "glo-astn-schema"
import * as gth from "glo-astn-typedhandlers"

export type IUnmarshallHandler<GPAnnotation> = {
    'handler': gth.IValueHandler<T.Annotation<GPAnnotation>>
    'onError': ($: T.UnmarshallError<GPAnnotation>, ) => void
}

export type FCreateUnmarshaller = <GPAnnotation>($: T.CreateUnmarshallerData<GPAnnotation>, $i: IUnmarshallHandler<GPAnnotation>,) => gh.IRequiredValueHandler<T.Annotation<GPAnnotation>>

export type FCreateUnmarshallErrorMessage = <GPAnnotation>($: T.UnmarshallErrorType<GPAnnotation>,) => gcommon.T.String

export type FDefaultInitializeValue = <GPAnnotation>($: gschema.T.value, $i: gth.IValueHandler<T.Annotation<GPAnnotation>>,) => void

export type FMultilineStringIsEmpty = <GPAnnotation>($: gh.T.MultilineString<T.Annotation<GPAnnotation>>,) => gcommon.T.Boolean

export type FStringsAreEqual = <GPAnnotation>($: T.NestedStrings<GPAnnotation>,) => gcommon.T.Boolean