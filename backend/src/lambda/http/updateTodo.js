import middy from "@middy/core"
import httpCors from "@middy/http-cors"
import httpErrorHandler from "@middy/http-error-handler"
import { updateTodo } from "../../businessLogic/todos.mjs";
import { getUserId } from "../utils.mjs";

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
  const updatedTodo = JSON.parse(event.body);

  await updateTodo(
    user_id,
    todoId,
    updatedTodo
  )
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 200,
    body: ''
  }

  })

