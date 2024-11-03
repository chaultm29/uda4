import middy from "@middy/core";
import httpCors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import { getUserId } from "../utils.mjs";
import { createLogger } from '../../utils/logger.mjs';
import { HttpStatusCode } from "axios";
import { getTodosList } from "../../businessLogic/todos.mjs";
import { parseUserId } from "../../auth/utils.mjs";

const logger = createLogger('TodoAccess!');
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Authorization,Content-Type'
};
export const handler = middy()
  .use(httpErrorHandler())
  .use(
    httpCors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing GetTodos event...', { event });
    const userId = getUserId(event);
    const todos = await getTodosList(userId);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        items: todos
      })
    }
  })

