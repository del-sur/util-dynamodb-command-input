import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'

import reservedWords from './reservedWords'

export default (input: DynamoDBUpdateSET): UpdateInputSET => {
  const { expressionArr, ExpressionAttributeValues, ExpressionAttributeNames } =
    Object.keys(input).reduce(
      (acc, key) => {
        let expression: string[] = [key, `:${key}`]
        let ExpressionAttributeNames = acc.ExpressionAttributeNames

        if (reservedWords.includes(key.toUpperCase())) {
          const attributeAlias = `#${key}`
          expression[0] = attributeAlias
          ExpressionAttributeNames = {
            ...ExpressionAttributeNames,
            [attributeAlias]: key,
          }
        }

        return {
          ...acc,
          expressionArr: acc.expressionArr.concat(expression.join(' = ')),
          ExpressionAttributeValues: {
            ...acc.ExpressionAttributeValues,
            ...marshall({ [`:${key}`]: input[key] }),
          },
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
