import * as AWS  from 'aws-sdk'
import { createLogger } from "../utils/logger";


export class RecipeStorage {

  constructor(
    private readonly s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION

    ) {
  }

  async generateUploadUrl(recipeId:string) {
    const logger = createLogger('generateUrl');
    logger.info('generating upload url ',recipeId)

    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: recipeId,
      Expires: this.urlExpiration
    })

  }

  generateRecipeItemAttechmentUrl (recipeId:string) : string {
    return `https://${this.bucketName}.s3.amazonaws.com/${recipeId}`
  }
}
