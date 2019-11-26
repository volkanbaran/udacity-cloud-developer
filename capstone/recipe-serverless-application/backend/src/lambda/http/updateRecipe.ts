import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateRecipeRequest } from '../../requests/UpdateRecipeRequest'
import { updateRecipe } from '../../businessLogic/recipes'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)
  const recipeId = event.pathParameters.recipeId
  const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)
  const updatedItem = await updateRecipe(userId, recipeId, updatedRecipe)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updatedItem
    })
  }
}
