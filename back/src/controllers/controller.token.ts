import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { SI } from '@shared/types';
import { getError } from './util/error-handler';

export const tokenController = (instance: FastifyInstance) => {
  const active = async (
    req: FastifyRequest,
    reply: FastifyReply,
  ): Promise<SI.ISimpleResponse> => {
    try {
      await req.jwtVerify();
      return reply.send({ message: 'success' });
    } catch (error) {
      console.error(JSON.stringify(error));
      return getError(reply, error);
    }
  };

  instance.get('v1/token/active', active);
};
