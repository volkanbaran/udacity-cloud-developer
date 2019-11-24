
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJVOPdJaQo2qkPMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1qazhxdDJwaC5hdXRoMC5jb20wHhcNMTkxMTE5MTk0NTI3WhcNMzMw
NzI4MTk0NTI3WjAhMR8wHQYDVQQDExZkZXYtams4cXQycGguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwzOZJyyYOIzN9kkAiVg8Lre2
ZA9nKHufgMjsNF8lLvAU9S6nyrvAh+t4B22HO3pn2VGVQDxvngXQS1+0Xq9Z9JUv
yAe5QgxuFTPDMk/fGYeJmDUNFo8LhGA5tSrSIILXCIa2KGiAt/x8Q2ZaRGG325er
tX8UXPdKEFQQckwathyRWNua5gT5MTEN9U+E2Uw/lJfIIrJ8XnfPYF1Hso/Vr/30
8l+vd8/ECPKpt2jJWMzOqBoKYblRp1W/pOBmH6a0b2vspsRfIjN3rhcTTLH2cCah
D4deQNrhAxpqkhVY1gHtpd83u34LesXK4DqJd6NXVv7Tx4e5TGny4pPc+/P7XQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSJZsDRRbak1uxfNHZB
L8LDsX88wzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAJBbFfOT
DOmr+YbiNP11pnT86t2nsUCDhG+//zx2kv3N1hQS1NsY6yissq9qvg0UIWgEPDOB
lYymUfUEYhrMLwRYoM3NHZu008ohoUYtOVztZ/9+taWLJkMz1DJA8DJacCUz1+O2
Z5X5X3fBJVCz+yBPYpih4gTDPMSn1zAD6QgezzuaugkHPQ3u6aWgMQoIrwtXnoE/
YBHEdDhAgjq/Q1JUizi6XbUNlgfaxliWrWhSusTXwPekNHfn16MgYgAZTrUcdH1h
ZmRsCGVVnvpbImogpfwmWT6DYZraEgCggVZPkmRq5vypteEycqh+MRMxI3yY8cnW
RCR/Nzt/3KwpCYk=
-----END CERTIFICATE-----
`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}
