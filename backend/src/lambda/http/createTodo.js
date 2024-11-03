

import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // Write your logic here
     const user_id = getUserId(event);
     //get new item
     const new_todo = JSON.parse(event.body);
     const new_item = await createTodo(new_todo, user_id) 
     console.log(new_item);
     return {
      statusCode: 201, //for create new todo
      body: JSON.stringify({
        item: new_item
      })
     }
  })

