import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
  // console.log('Received event:', JSON.stringify(event, null, 2)); 
  const authorization = event.headers.Authorization || event.headers.authorization;
  if (!authorization) {
    throw new Error('No Authorization header', authorization, event); 
  }
  const split = authorization.split(' ');
  if (split.length !== 2 || split[0] !== 'Bearer') {
    throw new Error('Invalid format Authorization header', authorization);
  }

  const jwtToken = split[1];

  return parseUserId(jwtToken)
}
