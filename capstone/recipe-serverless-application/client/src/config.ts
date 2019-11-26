// DONE:VB Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '4lljtl7jse'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // DONE:VB Create an Auth0 application and copy values from it into this map
  domain: 'dev-jk8qt2ph.auth0.com',            // Auth0 domain
  clientId: 'Wr0G2QlOj8T8ph5qMDM6lsy1QoFIsajZ',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
