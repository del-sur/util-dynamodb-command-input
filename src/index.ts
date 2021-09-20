import {mergeDeepRight} from 'ramda'

import toProjectionInput from './toProjectionInput'
import toUpdateItemInputSET from './toUpdateItemInputSET'

export { toProjectionInput, toUpdateItemInputSET }
export const toCommandInput: TransformFn = commandInput => {
  let ref = { ...commandInput }
  return {
    toProjectionInput: input => {
      const result = mergeDeepRight(ref, toProjectionInput(input))
      ref = result
      return  result
    },
    toUpdateItemInputSET: input => {
      const result = mergeDeepRight(ref, toUpdateItemInputSET(input))
      ref = result
      return  result
    },
  }
}
