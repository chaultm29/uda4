import httpCors from "@middy/http-cors"
import httpErrorHandler from "@middy/http-error-handler"
import { getUserId } from "../utils.mjs"
import { deleteTodo } from "../../businessLogic/todos.mjs"
import middy from "@middy/core"


export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId;
    const user_id = getUserId(event);
    await deleteTodo(
      user_id,
      todoId
    )
    return {
      statusCode: 204,
      body: ''
    }
  })

