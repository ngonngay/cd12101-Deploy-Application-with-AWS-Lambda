import 'source-map-support/register.js'

import middy from '@middy/core'
import httpCorsMiddleware from '@middy/http-cors'

import { getAll } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy({
  timeoutEarlyResponse: () => {
    return {
      statusCode: 408
    }
  }
}).handler(async (event) => {
  const userId = getUserId(event)
  const todos = await getAll(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  }
}).use(httpCorsMiddleware())
