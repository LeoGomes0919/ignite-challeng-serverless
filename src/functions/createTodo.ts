import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamodbClient';

interface ICreateTodo {
  id: string;
  title: string;
  deadline: Date;
};

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;
  const {
    id,
    title,
    deadline,
  } = JSON.parse(event.body) as ICreateTodo;

  const todo = {
    id,
    title,
    done: false,
    deadline,
    user_id: userId,
  }

  await document.put({
    TableName: 'todos',
    Item: todo,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Todo created',
    }),
    headers: {
      'Content-Type': 'application/json'
    },
  }
}