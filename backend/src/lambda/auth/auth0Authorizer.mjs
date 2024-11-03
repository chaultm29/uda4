import Axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
const { decode, verify } = jsonwebtoken;
import { createLogger } from '../../utils/logger.mjs';



const logger = createLogger('auth')

const jwksUrl = 'https://dev-4pcnrsfwj1wtoofa.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    logger.info('jwtToken', event.authorizationToken);
    const jwtToken = await verifyToken(event.authorizationToken)

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
    logger.error('User not authorized', { error: e.message })

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

async function verifyToken(authHeader) {
  // if (!authHeader) throw new Error('authen header not found');
  logger.info('verifying');
  logger.info('headerverifyToken', authHeader);
  const token = getToken(authHeader)
  const jwt = decode(token, { complete: true })
  if (!jwt) {
    throw new Error('Invalid token structure');
  }

  const resp = await Axios.get(jwksUrl);
  const keys = resp.data.keys;
  const jwSigningKey = keys.find(key => key.kid === jwt.header.kid);
  logger.info('jwsigning key', jwSigningKey);


  if(!jwSigningKey) {
    throw new Error('The endpoint has such no key!!!');
  }

  const pemData = jwSigningKey.x5c[0];

  const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`;
  // Xác thực token với khóa công khai
  // const verifiedToken = verify(token, signingKey.publicKey) as JwtToken;
  
  //const publicKey = jwSigningKey.getPublicKey();
  try {
    const result = verify(token, cert, { algorithms: ['RS256'] });
    logger.info('Token verified successfully', result);
    return result;
  } catch (error) {
    logger.error('Token verification failed', error);
    throw new Error('Token verification failed');
  }


}

function getToken(authHeader) {
  logger.info('header', authHeader);
  console.log('head', authHeader);
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

