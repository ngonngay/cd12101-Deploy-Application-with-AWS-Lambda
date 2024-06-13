import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { generateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)
  const uploadUrl = await generateAttachmentUrl(userId, todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
}).use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
