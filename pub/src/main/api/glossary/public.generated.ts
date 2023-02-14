import * as pt from 'pareto-core-types'

import { T   } from './types.generated'

import * as mcommon from "glo-pareto-common"

export type FCreateUnmarshallErrorMessage = <GPAnnotation>($: T.UnmarshallErrorType<GPAnnotation>,) => mcommon.T.String