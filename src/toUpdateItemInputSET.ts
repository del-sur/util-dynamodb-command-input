import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

import reservedWords from './reservedWords'

export default (input: DynamoDBUpdateSET): UpdateInputSET => {
  const { expressionArr, ExpressionAttributeValues, ExpressionAttributeNames } =
    Object.keys(input).reduce(
      (acc, key) => {
        let expression: Array<[string, string]> = [[key, `:${key}`]]
        let ExpressionAttributeNames = acc.ExpressionAttributeNames
        let ExpressionAttributeValues = acc.ExpressionAttributeValues

        if (reservedWords.includes(key.toUpperCase())) {
          const attributeAlias = `#${key}`
          expression[0][0] = attributeAlias
          ExpressionAttributeNames = {
            ...ExpressionAttributeNames,
            [attributeAlias]: key,
          }
        }

        if (typeof input[key] === 'object' && input[key] !== null) {
          const parent = expression[0][0]
          const nestedKeys = Object.keys(input[key])

          expression = []

          nestedKeys.forEach(nestedKey => {
            const valueKey = `:${parent.replace('#', '')}${nestedKey}`
            expression = [
              ...expression,
              [`${parent}.${nestedKey}`, valueKey],
            ]
            ExpressionAttributeValues = {
              ...ExpressionAttributeValues,
              ...marshall({ [valueKey]: input[key][nestedKey] }),
            }
          })
        } else {
          ExpressionAttributeValues = {
            ...ExpressionAttributeValues,
            ...marshall({ [`:${key}`]: input[key] }),
          }
        }

        return {
          ...acc,
          expressionArr: acc.expressionArr.concat(
            expression.map(i => i.join(' = '))
          ),
          ExpressionAttributeValues,
          ExpressionAttributeNames,
        }
      },
      {
        expressionArr: [] as string[],
        ExpressionAttributeValues: {} as { [key: string]: AttributeValue },
        ExpressionAttributeNames: {} as { [key: string]: any },
      },
    )
  const result = {
    UpdateExpression: `SET ${expressionArr.join(', ')}`,
    ExpressionAttributeValues,
    ...(!!Object.keys(ExpressionAttributeNames).length && {
      ExpressionAttributeNames,
    }),
  }
  return result
}
