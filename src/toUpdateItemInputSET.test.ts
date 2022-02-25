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

describe('Generating DynamoDB command input for nested values', () => {
  let result: { [key: string]: any }

  beforeEach(() => {
    const updateValuesObj = {
      foo: 'bar',
      status: {
        name: 'active',
      },
      nested: {
        a: 1,
        b: 2,
        c: 'three',
      },
    }
    result = toUpdateInput(updateValuesObj)
  })

  it('Sets UpdateExpression for each nested key', () => {
    expect(result.UpdateExpression).toBe(
      'SET foo = :foo, #status.name = :statusname, nested.a = :nesteda, nested.b = :nestedb, nested.c = :nestedc',
    )
  })

  it('Sets ExpressionAttributeValues', () => {
    expect(result.ExpressionAttributeNames).toEqual({
      '#status': 'status',
    })
  })

  it('Sets ExpressionAttributeNames', () => {
    expect(result.ExpressionAttributeValues).toEqual(
      marshall({
        ':foo': 'bar',
        ':statusname': 'active',
        ':nesteda': 1,
        ':nestedb': 2,
        ':nestedc': 'three',
      }),
    )
  })
})
