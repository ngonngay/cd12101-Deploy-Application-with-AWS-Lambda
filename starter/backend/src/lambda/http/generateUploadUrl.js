import 'source-map-support/register.js'
import middy from '@middy/core'
import httpCorsMiddleware from '@middy/http-cors'
import httpErrorHandlerMiddleware from '@middy/http-error-handler'


import { generateAttachmentUrl } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy({
  timeoutEarlyResponse: () => {
    return {
      statusCode: 408
    }
  }
}).handler(async (event) => {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)
  const uploadUrl = await generateAttachmentUrl(userId, todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})
.use(httpErrorHandlerMiddleware())
.use(httpCorsMiddleware())

