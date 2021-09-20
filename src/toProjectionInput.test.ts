import toProjectionInput from './toProjectionInput'

describe('Generating DynamoDB projection expressions', () => {
  it('Sets ProjectionExpression', () => {
    const { ProjectionExpression, ExpressionAttributeNames } =
      toProjectionInput(['price', 'quantity'])
    expect(ProjectionExpression).toBe('price,quantity')
    expect(ExpressionAttributeNames).toBeUndefined()
  })

  it('Sets ExpressionAttributeNames if applicable', () => {
    const { ProjectionExpression, ExpressionAttributeNames } =
      toProjectionInput(['name', 'price', 'status', 'quantity'])
    expect(ProjectionExpression).toBe('#name,price,#status,quantity')
    expect(JSON.stringify(ExpressionAttributeNames)).toBe(
      JSON.stringify({
        '#name': 'name',
        '#status': 'status',
      }),
    )
  })
})
