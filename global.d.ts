declare type DynamoDBAttributeValue = import('@aws-sdk/client-dynamodb').AttributeValue

declare type AttributesToGet = string[]
declare interface ProjectionExpressionCommandInput {
  ProjectionExpression: string
  ExpressionAttributeNames?: { [key: string]: string }
}
declare type ToProjectionInputFn = (dynamoDbFields: AttributesToGet) => ProjectionExpressionCommandInput

declare type DynamoDBUpdateSET = { [field: string]: any }
declare interface UpdateInputSET {
  UpdateExpression: string
  ExpressionAttributeValues: { [key: string]: DynamoDBAttributeValue }
  ExpressionAttributeNames?: { [key: string]: string }
}
declare type ToUpdateItemInputSETFn = (updates: DynamoDBUpdateSET) => UpdateInputSET

declare type DynamoDBCommandInput = { [InputKey: string]: any }
declare type ToCommandInputFn = (commandInput: DynamoDBCommandInput) => {
  toProjectionInput: ToProjectionInputFn
  toUpdateItemInputSET: ToUpdateItemInputSETFn
}
