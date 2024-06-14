import 'source-map-support/register.js'
import middy from '@middy/core'
import httpCorsMiddleware from '@middy/http-cors'
import httpErrorHandlerMiddleware from '@middy/http-error-handler'


import { update } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy({
  timeoutEarlyResponse: () => {
    return {
      statusCode: 408
    }
  }
}).handler(async (event) => {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  const userId = getUserId(event)
  await update(userId, todoId, updatedTodo)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
})
.use(httpErrorHandlerMiddleware())
.use(httpCorsMiddleware())

