import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import {TodoUpdate} from '../models/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    ) {
  }

  async getUserTodos(userId): Promise<TodoItem[]> {
    const logger = createLogger('getUserTodos');
    logger.info('getUserTodos ', userId);

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    const logger = createLogger('create-todo');
    logger.info('Creating a todo item ', {...todo});

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async deleteTodo(userId:String, todoId: string){
    const logger = createLogger('delete-todo');
    logger.info('deleting item', {userId,todoId})

    await this.docClient.delete({
        TableName:this.todosTable,
        Key: { userId:userId, todoId:todoId}
    }).promise()
  }


  async updateTodo(userId:string, todoId:string ,todoUpdate:TodoUpdate): Promise<TodoUpdate> {
    const logger = createLogger('update-todo');
    logger.info('updateing item', {userId,todoId,...todoUpdate})

    await this.docClient.update({
      TableName: this.todosTable,
      Key: { 'todoId': todoId, 'userId': userId },
      UpdateExpression: 'set #name = :n, done = :d, dueDate = :dt , #url = :url',
      ExpressionAttributeNames:{
          "#name": "name",
          "#url": "url"
      },
      ExpressionAttributeValues: {
          ':n' : todoUpdate.name,
          ':d' : todoUpdate.done,
          ':dt': todoUpdate.dueDate,
          ':url': 'vbaran'
      },
      ReturnValues: 'UPDATED_NEW'
  }).promise()

    return todoUpdate;
  }

  async addTodoUrl(userId:string, todoId:string, attechmentUrl:string) {
    const logger = createLogger('update-todo');
    logger.info('updating item url ', {userId,todoId})

    await this.docClient.update({
      TableName: this.todosTable,
      Key: { 'todoId': todoId, 'userId': userId },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames:{
          "#attachmentUrl": "attachmentUrl"
      },
      ExpressionAttributeValues: {
          ':attachmentUrl': attechmentUrl
      }
  }).promise()  
  }

}


function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
