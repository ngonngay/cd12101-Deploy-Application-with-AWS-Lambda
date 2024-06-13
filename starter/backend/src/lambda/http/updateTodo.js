import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  const userId = getUserId(event)
  await updateTodo(userId, todoId, updatedTodo)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
}).use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
