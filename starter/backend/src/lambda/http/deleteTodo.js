import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { remove } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId
  // TODO: Remove a TODO item by id

  const userId = getUserId(event)

  await remove(userId, todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({})
  }
}).use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
