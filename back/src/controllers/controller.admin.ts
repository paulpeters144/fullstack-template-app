import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { IUserManager } from '@src/manager';
import { ST, SI } from '@shared/types';

import { getError } from './util/error-handler';

export const adminController = (instance: FastifyInstance) => {
  const register = async (
    req: FastifyRequest<{ Body: ST.Register }>,
    reply: FastifyReply,
  ): Promise<SI.ISimpleResponse> => {
    try {
      ST.RegisterSchema.parse(req.body);
      const userManagerResult = req.get<IUserManager>('userManager');
      if (!userManagerResult.ok) {
        return reply.code(500).send({ error: 'unknown error' });
      }
      const userManager = userManagerResult.value;

      const result = await userManager.registerAdmin(req.body);
      if (!result.ok) {
        const message: SI.IFriendlyError = { error: result.value.message };
        return reply.code(400).send(message);
      }
      return reply.send({ message: 'success' });
    } catch (error) {
      console.error(JSON.stringify(error));
      return getError(reply, error);
    }
  };

  const authorize = async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.url.match('/admin')) {
      try {
        const valid = instance.validateRole('admin', req);
        if (!valid.ok) {
          return reply.code(401).send({ message: 'Unauthorized' });
        }

        await req.jwtVerify();
      } catch (error) {
        console.error(JSON.stringify(error));
        reply.code(401).send({ message: 'Unauthorized' });
      }
    }
  };

  instance.post('v1/admin/register', register);
  instance.addHook('onRequest', authorize);
};
