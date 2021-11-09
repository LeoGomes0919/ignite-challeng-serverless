import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;

  const response = await document.scan({
    TableName: 'todos',
    FilterExpression: 'user_id = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    }
  }).promise();

  const userTodos = response.Items[0];

  if (!userTodos) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Todos not found',
      })
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'All Todos from User',
      todos: response.Items[0],
    })
  }
}