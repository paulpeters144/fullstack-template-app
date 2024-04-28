import fastify, { FastifyInstance } from 'fastify';

import * as configure from './config/api.startup';
import * as extend from './config/api.extend';

export const app: FastifyInstance = fastify();
const PORT = 3000;

extend.fastifyRequest(app);
extend.fastifyInstance(app);

configure.registerControllers(app);
configure.registerServices(app);
configure.registerJwtSignature(app);
configure.registerCors(app);

if (require.main === module) {
  app.listen({ host: '0.0.0.0', port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${address}`);
  });
}
