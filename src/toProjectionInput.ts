import { isEmpty } from 'ramda'

import reservedWords from './reservedWords'

export default (dynamoDbFields: AttributesToGet): ProjectionExpressionCommandInput => {
  let ExpressionAttributeNames: { [key: string]: string } = {}
  const transformKey = (key: string): string => {
    let fieldName = key
    if (reservedWords.includes(key.toUpperCase())) {
      const alias = `#${fieldName}`
      ExpressionAttributeNames[alias] = fieldName
      fieldName = alias
    }
    return fieldName
  }
  return {
    ProjectionExpression: dynamoDbFields.map(transformKey).join(','),
    ...(!isEmpty(ExpressionAttributeNames) && { ExpressionAttributeNames }),
  }
}
