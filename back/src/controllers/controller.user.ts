import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { ST, SI } from '@shared/types';
import { getError } from '@src/controllers/util/error-handler';
import { IUserManager } from '@src/manager';

export const userController = (instance: FastifyInstance) => {
  const simpleHello = async (
    req: FastifyRequest<{ Body: ST.Person }>,
    reply: FastifyReply,
  ) => {
    try {
      ST.PersonSchema.parse(req.body);
      const { name, age } = req.body;
      return reply.send({ message: `Hello, ${name}!!! You are ${age} years old.` });
    } catch (error) {
      return getError(reply, error);
    }
  };

  const login = async (
    req: FastifyRequest<{ Body: ST.LoginRequest }>,
    reply: FastifyReply,
  ): Promise<SI.IAccessToken> => {
    try {
      ST.LoginSchema.parse(req.body);
      const loginRequest = req.body as ST.LoginRequest;
      const userManagerResult = req.get<IUserManager>('userManager');
      if (!userManagerResult.ok) {
        return reply.code(500).send({ error: 'unknown error' });
      }
      const userManager = userManagerResult.value;
      const claimsResult = await userManager.login(loginRequest);
      if (!claimsResult.ok) {
        return reply.code(400).send({ error: claimsResult.value });
      }
      if (claimsResult.value) {
        const token = instance.jwt.sign(claimsResult.value, { expiresIn: '96h' });
        return { accessToken: token };
      }
      return reply.code(500).send({ error: 'unknown error' });
    } catch (error) {
      return getError(reply, error);
    }
  };

  const authorize = async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.url.match('/sayhello')) {
      try {
        await req.jwtVerify();
      } catch (error) {
        reply.code(401).send({ message: 'Unauthorized' });
      }
    }
  };

  instance.post('v1/user/sayhello', simpleHello);
  instance.post('v1/user/login', login);
  instance.addHook('onRequest', authorize);
};
