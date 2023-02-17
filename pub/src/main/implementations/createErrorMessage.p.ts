
import * as pl from 'pareto-core-lib'

import * as api from "../api"

export const $$: api.CcreateErrorMessage = ($d) => {
    return ($) => {
        switch ($[0]) {
            case 'missing elements':
                return pl.cc($[1], ($) => {
                    return `missing elements: ${$d.getArrayAsString($.elements)}`
                })
            case 'object is not a dictionary': {
                return `object is not a dictionary: { }`
            }
            case 'property key does not have apostrophes': {
                return `property key does not have apostrophes`
            }
            case 'entry key does not have quotes': {
                return `entry key does not have quotes`
            }
            case 'duplicate key': {
                return `duplicate key`
            }
            case 'array is not a list': {
                return `array is not a list: []`
            }
            case 'missing option': {
                return `missing option`
            }
            case 'unknown option': {
                return pl.cc($[1], ($) => {
                    return `unknown option, choose from: ${$d.getKeysAsString($['known options'].map($ => null))}`
                })
            }
            case 'unknown property': {
                return pl.cc($[1], ($) => {
                    return `unknown property, choose from: ${$d.getKeysAsString($['known properties'].map($ => null))}`
                })
            }
            case 'value should have quotes': {
                return `value should have quotes: \"...\"`
            }
            case 'value should not have quotes': {
                return `value should not have quotes`
            }
            case 'value should not have apostrophes': {
                return `value should not have apostrophes`
            }
            case 'value should have quotes instead of apostrophes': {
                return `value should have quotes instead of apostrophes`
            }
            case 'expected a group': {
                return `expected a group`
            }
            case 'expected an unquoted string': {
                return `expected an unquoted string`
            }
            case 'expected a quoted string': {
                return `expected a quoted string: \"...\"`
            }
            case 'expected a tagged union': {
                return `expected a tagged union: | 'option' ...`
            }
            case 'expected a list': {
                return `expected a list: []`
            }
            case 'expected a dictionary': {
                return `expected a dictionary: {}`
            }
            case 'expected a multiline string': {
                return `expected a multiline string: \`...\``
            }
            case 'object is not a verbose group': {
                return `object is not a verbose group: ()`
            }
            case 'array is not a shorthand group': {
                return `array is not a shorthand group: <>`
            }
            case 'superfluous element': {
                return `superfluous element`
            }
            case 'missing elements': {
                return pl.cc($[1], ($) => {
                    return `${$d.getLengthAsString($.elements.map($ => null))} missing element(s): ${$d.getArrayAsString($.elements)}`
                })
            }
            case 'this is interpreted as an option, expected apostrophes': {
                return `this is interpreted as an option, expected apostrophes`
            }
            case 'property has default value, remove': {
                return `property has default value, remove`
            }
            default:
                return pl.au($[0])
        }
    }
}