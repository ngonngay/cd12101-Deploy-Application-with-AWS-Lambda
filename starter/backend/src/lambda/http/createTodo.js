import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { create } from '../../businessLogic/todos'

export const handler = middy(async (event) => {
  const newTodo = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item

  console.log('Processing Event ', event)
  const userId = getUserId(event)

  const result = await create(newTodo, userId)
  if (!result) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        item: 'bad request'
      })
    }
  }
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: result
    })
  }
}).use(
  cors({
    credentials: true
  })
)
