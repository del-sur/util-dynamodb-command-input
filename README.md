# Utility functions for @aws-sdk/client-dynamodb commands
Create and map input for certain [`@aws-sdk/client-dynamodb`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html). Aliases are also set, if applicable (i.e. if a provided field is a [reserved word](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)).

## Installation
```bash
npm install util-dynamodb-command-input
```

## Functions
```ts
toProjectionInput(dynamoDbFields: string[]) => {
  ProjectionExpression: string
  ExpressionAttributeNames?: { [key: string]: string }
}

```
Specify DynamoDB item fields that you want to get from a command.

```ts
toUpdateItemInputSET(updates: { [dynamoDbField: string]: any }) => {
  UpdateExpression: string
  ExpressionAttributeValues: { [key: string]: AttributeValue }
  ExpressionAttributeNames?: { [key: string]: string }
}

```
Translate a JavaScript Object of field upadates to the following `UpdateItemCommandInput` properties: 
- `UpdateExpression`: Update values are mapped to this comma separated string ([more about update expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html)).
- `ExpressionAttributeValues`: Marshalled update values. Uses `marshall` from `@aws-sdk/util-dynamodb` under the hood.
- `ExpressionAttributeNames`: Aliases for reserved words, if any
`AttributeValue` is imported from `@aws-sdk/client-dynamodb`

## Peer devDependencies
```bash
@aws-sdk/client-dynamodb
@aws-sdk/util-dynamodb
```

Assumes that most projects using this already have the above dependencies. Kindly `npm install --save` them, if not.

## Usage
Can be used individually:
```ts
import { toProjectionInput, toUpdateItemInputSET } from 'util-dynamodb-command-input'

const queryResponse = await dynamoDBClient.send(new QueryCommand({
  ...queryCommandInput,
  ...toProjectionInput(['foo']),
}))

const updateResponse = await dynamoDBClient.send(new UpdateItemCommand({
  ...updateItemCommandInput,
  ...toUpdateItemInputSET({ foo: 'baz' }),
}))
```

To chain functions on common command inputs:
```ts
import { toCommandInput } from 'util-dynamodb-command-input'

// Common input props will not be overriden
const { toProjectionInput, toUpdateItemInputSET } = toCommandInput({
  TableName: 'FooBarBaz',
  ...otherCommonProps,
})

const input = {
  ...toProjectionInput(['foo']),
  ...toUpdateItemInputSET({ foo: 'baz' }),
}

const updateResponse = await dynamoDBClient.send(new UpdateItemCommand(input))
```
Note that toCommandInput does a deep merge on common props and function results.

## Development
Build with esbuild:
```bash
npm run build
```
Run tests with jest:
```bash
npm run test
```
