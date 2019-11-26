import * as uuid from 'uuid'

import { RecipeItem } from '../models/RecipeItem'
import { RecipeUpdate } from '../models/RecipeUpdate'
import { RecipeAccess } from '../dataLayer/recipesAccess'
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest';
import { RecipeStorage } from '../fileStorage/recipeStorage';

const recipesAccess = new RecipeAccess()
const recipesStorage = new RecipeStorage()

export async function generateUploadUrl(userId: string, recipeId: string): Promise<string> {

    const uploadUrl = await recipesStorage.generateUploadUrl(recipeId)
    await recipesAccess.addRecipeUrl(userId, recipeId, recipesStorage.generateRecipeItemAttechmentUrl(recipeId))

    return uploadUrl
}

export async function getUserRecipes(userId: string): Promise<RecipeItem[]> {
    return recipesAccess.getUserRecipes(userId)
}

export async function createRecipe(CreateRecipeRequest: CreateRecipeRequest, userId: string): Promise<RecipeItem> {

    const itemId = uuid.v4()

    return await recipesAccess.createRecipe({
        recipeId: itemId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: CreateRecipeRequest.name
    })
}

export async function deleteRecipe(userId: string, recipeId: string, ) {
    await recipesAccess.deleteRecipe(userId, recipeId)
}

export async function updateRecipe(userId: string, recipeId: string, recipeUpdate: UpdateRecipeRequest): Promise<RecipeUpdate> {
    return await recipesAccess.updateRecipe(userId, recipeId, {
        name: recipeUpdate.name,
        description: recipeUpdate.description
    })
}