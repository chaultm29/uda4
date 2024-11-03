import { v4 as uuidv4 } from 'uuid';
import { getUserId } from '../lambda/utils.mjs';
import TodosAccess from '../dataLayer/todoAccess.mjs'; 
import { createLogger } from '../utils/logger.mjs';
import { parseUserId } from '../auth/utils.mjs';
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs';


const logger = createLogger('TodoAccess');
const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();
export async function getTodosList(jwtToken) {
    logger.info("businesslogic jwttoken", jwtToken);
    // const userId = parseUserId(jwtToken);
    return todosAccess.getTodosList(jwtToken);
}

export async function createTodo(newTodoData, jwtToken) {
  const todoId = uuidv4();
  const userId = jwtToken;
//   const userId = getUserId(jwtToken);
  const createdAt = new Date().toISOString();
  const done = false;
  const attachURL = attachmentUtils.getAttachmentUrl(todoId);

  const newTodo = { todoId, userId, createdAt, done, attachmentUrl: attachURL, ...newTodoData };
  
  return await todosAccess.createTodoItem(newTodo).then(createdTodo => {
            console.log('Todo item created successfully:', createdTodo);
        })
        .catch(error => {
            console.error('Error creating todo item:', error);
        });
}

export async function updateTodo(user_id, todoId, updatedData) {
    // const updateTodoField = { todoId, user_id, updatedData };
    logger.info("Update todos function business logic");
    return todosAccess.updateTodoItem(user_id, todoId, updatedData); 
}

export async function deleteTodo(user_id, todoId) {
    logger.info("Delete todos function business logic");
    return todosAccess.deleteTodoItem(user_id, todoId);
}

export async function createAttachPresignedUrl(user_id, todoId) {
    logger.info("attach todos function business logic");
    return attachmentUtils.getUploadUrl(todoId);
}
