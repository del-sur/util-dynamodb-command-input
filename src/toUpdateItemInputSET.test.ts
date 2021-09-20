import { marshall } from '@aws-sdk/util-dynamodb'

import toUpdateInput from './toUpdateItemInputSET'

describe('Generating DynamoDB command input', () => {
  let result: { [key: string]: any }

  beforeEach(() => {
    const updateValuesObj = {
      status: 'active',
      rank: 6,
      foo: 'bar',
    }
    result = toUpdateInput(updateValuesObj)
  })

  it('Sets UpdateExpression', () => {
    expect(result.UpdateExpression).toBe(
      'SET #status = :status, #rank = :rank, foo = :foo',
    )
  })

  it('Sets ExpressionAttributeValues', () => {
    expect(result.ExpressionAttributeNames).toEqual({
      '#status': 'status',
      '#rank': 'rank',
    })
  })

  it('Sets ExpressionAttributeNames', () => {
    expect(result.ExpressionAttributeValues).toEqual(
      marshall({
        ':status': 'active',
        ':rank': 6,
        ':foo': 'bar',
      }),
    )
  })
})
