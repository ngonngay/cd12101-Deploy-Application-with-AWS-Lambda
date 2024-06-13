import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAll } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event)=> {
    const userId = getUserId(event)
    const todos = await getAll(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)