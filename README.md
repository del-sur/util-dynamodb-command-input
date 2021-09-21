# Utility functions for @aws-sdk/client-dynamodb commands
A common DynamoDB error stems from field names being [reserved words](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html). One may run into this when specifying a `ProjectionExpression` for getting/scanning/querying items, or `UpdateExpression` and `ExpressionAttributeValues` for updating items. These utility functions detect those reserved words, generate aliases, and format command input accordingly.

You input once and become more declarative. Formatting, mapping, and aliasing are handled by these utilities for your convenience.

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
- `ExpressionAttributeNames`: Aliases for reserved words, if any. `AttributeValue` is imported from `@aws-sdk/client-dynamodb`

## Usage
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

## Development
Build with esbuild:
```bash
npm run build
```
Run tests with jest:
```bash
npm run test
```

## Peer dependencies
```bash
@aws-sdk/client-dynamodb
@aws-sdk/util-dynamodb
```

It is assumed that most projects using this already have the above dependencies. Kindly `npm install --save` them, if not.

## TODOs
- Utilities for `REMOVE`, `ADD`, `DELETE`.
- Utilities for other command inputs that need formatting and alias mapping.
