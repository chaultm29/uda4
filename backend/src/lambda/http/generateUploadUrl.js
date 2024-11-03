import middy from "@middy/core"
import httpCors from "@middy/http-cors"
import httpErrorHandler from "@middy/http-error-handler"
import { getUserId } from "../utils.mjs"
import { createAttachPresignedUrl } from "../../businessLogic/todos.mjs"

// export function handler(event) {
//   const todoId = event.pathParameters.todoId

//   // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
//   return undefined
// }

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const user_id = getUserId(event);
    const todoId = event.pathParameters.todoId;
    const url = await createAttachPresignedUrl(
      user_id,
      todoId
    )
    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }

  })

