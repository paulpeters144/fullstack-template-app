import { FastifyInstance } from 'fastify';
import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix';
import { asFunction } from 'awilix';
import fjwt from '@fastify/jwt';
import cors from '@fastify/cors';

import * as controller from '@src/controllers';
import { createDDBAccess } from '@src/access/ddb.access';
import { createUserManager } from '@src/manager';
import { AppConfig } from '@src/config/env.config';
import { createUserFactory } from '@src/manager/user.manager/util/user.factory';

import dotenv from 'dotenv';

import { corsPolicy } from './cors-policy';
import { Stage } from '@shared/types/shared.types';
dotenv.config();

export const STAGE: Stage = getStage();
console.log('STARTUP STAGE: ' + STAGE);

export function registerControllers(instance: FastifyInstance) {
  controller.userController(instance);
  controller.adminController(instance);
  controller.tokenController(instance);
}

export function registerServices(instance: FastifyInstance) {
  instance.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
  });

  const appConfig = AppConfig(STAGE);
  diContainer.register({
    userManager: asFunction(createUserManager)
      .inject(() => ({
        userFactory: createUserFactory(),
        ddbAccess: createDDBAccess(appConfig),
      }))
      .singleton(),
    appConfig: asFunction(AppConfig).singleton(),
    ddbAccess: asFunction(createDDBAccess).singleton(),
    userFactory: asFunction(createUserFactory).singleton(),
  });
}

export function registerJwtSignature(instance: FastifyInstance) {
  const appConfig = AppConfig(STAGE);
  instance.register(fjwt, { secret: appConfig.ACCESS_TOKEN! });
}

export function registerCors(instance: FastifyInstance) {
  instance.register(cors, {
    origin: (origin, cb) => corsPolicy(origin, cb),
  });
}

function getStage(): Stage {
  const result = process.env.STAGE?.trim();
  if (!result) {
    return 'development';
  }
  if (['development', 'test', 'production'].includes(result)) {
    return result as Stage;
  }
  return 'development';
}
