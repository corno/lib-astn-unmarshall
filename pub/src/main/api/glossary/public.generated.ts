import * as pt from 'pareto-core-types'

import { T   } from './types.generated'

import * as mcommon from "glo-pareto-common"
import * as mh from "glo-astn-handlers"
import * as mschema from "glo-astn-schema"
import * as mth from "glo-astn-typedhandlers"

export type FCreateUnmarshaller = <GPAnnotation>($: T.CreateUnmarshallerData<GPAnnotation>,) => mh.IRequiredValueHandler<T.Annotation<GPAnnotation>>

export type FCreateUnmarshallErrorMessage = <GPAnnotation>($: T.UnmarshallErrorType<GPAnnotation>,) => mcommon.T.String

export type FDefaultInitializeValue = <GPAnnotation>($: mschema.T.value, $i: mth.IValueHandler<T.Annotation<GPAnnotation>>,) => void