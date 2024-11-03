import AWS from 'aws-sdk';
import AWSXray from 'aws-xray-sdk';
import { createLogger } from '../utils/logger.mjs';

const XAWS = AWSXray.captureAWS(AWS);

const logger = createLogger('TodoAccess!');

export default class TodosAccess {
    constructor(
        docClient = createDynamoDBClient(),
        todosTable = process.env.TODOS_TABLE,
        todosIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
        this.docClient = docClient;
        this.todosTable = todosTable;
        this.todosIndex = todosIndex;
    }
    async getTodosList(userId) {
        console.log("get todos");
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId' : userId
            }
        }).promise();
        return result.Items;
    }
    async createTodoItem(todoItem) {
        const createResult = await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem,
            ReturnValues: "ALL_OLD"
        }).promise();
        logger.info("todo created successfully", createResult);
        return createResult;
    }

    async updateTodoItem(user_id, todoId, updatedData) {
        const updateParams = {
            TableName: this.todosTable,
            Key: {
                "todoId" : todoId,
                "userId": user_id
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': updatedData.name,
                ':dueDate': updatedData.dueDate,
                ':done': updatedData.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues: "UPDATED_NEW"
        };
        const updateResult = await this.docClient.update(updateParams).promise();
        logger.info("todo updated successfully", updateResult);
        return updateResult;
    }

    async deleteTodoItem(user_id, todoId) {
        const deleteResult = await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                "todoId" : todoId,
                "userId": user_id
            },
            ReturnValues: "ALL_OLD"
        }).promise();
        logger.info("todo deleted successfully", deleteResult);
        return deleteResult;
    }
    //out of range
    async setItemUrl(todoId, createdAt, itemUrl) {
        const params = {
            TableName: this.todosTable,
            Key: {
                todoId,
                createdAt
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': itemUrl
            },
            ReturnValues: 'UPDATED_NEW'
        }

        await this.docClient.update(params).promise();
    }
}
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8005'
        })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
}

