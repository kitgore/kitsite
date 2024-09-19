import { onRequest } from 'firebase-functions/v2/https';
  const server = import('firebase-frameworks');
  export const ssrkitgoresite = onRequest({"region":"us-east1","invoker":"public"}, (req, res) => server.then(it => it.handle(req, res)));
  