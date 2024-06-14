import 'source-map-support/register.js'

import middy from '@middy/core'
import httpCorsMiddleware from '@middy/http-cors'

import { getUserId } from '../utils.mjs'
import { create } from '../../businessLogic/todos.mjs'

export const handler = middy({
  timeoutEarlyResponse: () => {
    return {
      statusCode: 408
    }
  }
}).handler(async (event) => {
  const newTodo = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item

  console.log('Processing Event ', event)
  const userId = getUserId(event)

  const result = await create(newTodo, userId)
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: result
    })
  }
}).use(httpCorsMiddleware())
