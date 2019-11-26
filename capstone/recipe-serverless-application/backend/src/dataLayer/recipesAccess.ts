import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS)

import { RecipeItem } from '../models/RecipeItem'
import {RecipeUpdate} from '../models/RecipeUpdate'

export class RecipeAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly recipesTable = process.env.RECIPES_TABLE,
    ) {
  }

  async getUserRecipes(userId): Promise<RecipeItem[]> {
    const logger = createLogger('getUserrecipes');
    logger.info('getUserRecipes ', userId);

    const result = await this.docClient.query({
      TableName: this.recipesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as RecipeItem[]
  }

  async createRecipe(recipe: RecipeItem): Promise<RecipeItem> {
    const logger = createLogger('create-recipe');
    logger.info('Creating a recipe item ', {...recipe});

    await this.docClient.put({
      TableName: this.recipesTable,
      Item: recipe
    }).promise()

    return recipe
  }

  async deleteRecipe(userId:String, recipeId: string){
    const logger = createLogger('delete-recipe');
    logger.info('deleting item', {userId,recipeId})

    await this.docClient.delete({
        TableName:this.recipesTable,
        Key: { userId:userId, recipeId:recipeId}
    }).promise()
  }


  async updateRecipe(userId:string, recipeId:string ,recipeUpdate:RecipeUpdate): Promise<RecipeUpdate> {
    const logger = createLogger('update-recipe');
    logger.info('updateing item', {userId,recipeId,...recipeUpdate})

    await this.docClient.update({
      TableName: this.recipesTable,
      Key: { 'recipeId': recipeId, 'userId': userId },
      UpdateExpression: 'set #name = :n,  description = :description',
      ExpressionAttributeNames:{
          "#name": "name"
      },
      ExpressionAttributeValues: {
          ':n' : recipeUpdate.name,
          ':description': recipeUpdate.description
      },
      ReturnValues: 'UPDATED_NEW'
  }).promise()

    return recipeUpdate;
  }

  async addRecipeUrl(userId:string, recipeId:string, attechmentUrl:string) {
    const logger = createLogger('update-recipe');
    logger.info('updating item url ', {userId,recipeId})

    await this.docClient.update({
      TableName: this.recipesTable,
      Key: { 'recipeId': recipeId, 'userId': userId },
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
