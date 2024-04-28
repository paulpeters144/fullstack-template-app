import { FastifyInstance, FastifyRequest } from 'fastify';
import { VerifyPayloadType } from '@fastify/jwt';

import { SI } from '@shared/types';
import { OK, Err, TPromise, Err, TResult, Val, TVoid } from '@shared/types/result';

declare module 'fastify' {
  interface FastifyRequest {
    get<T>(className: string): TResult<T>;
    getClaims(instance: FastifyInstance): TResult<VerifyPayloadType>;
    authenticated(): TPromise<TVoid>;
  }
  interface FastifyInstance {
    validateRole: (role: string, req: FastifyRequest) => TResult<TVoid>;
  }
}

export function fastifyRequest(instance: FastifyInstance) {
  instance.decorateRequest('get', function <
    T,
  >(this: FastifyRequest, className: string): TResult<T> {
    if (this.diScope.hasRegistration(className)) {
      return Val(this.diScope.resolve<T>(className));
    } else {
      return Err(`class not registered in diScope: ${className}`);
    }
  });

  instance.decorateRequest(
    'authenticated',
    async function (this: FastifyRequest): TPromise<TVoid> {
      try {
        await this.jwtVerify();
        return OK();
      } catch (error) {
        return Err(error);
      }
    },
  );

  instance.decorateRequest(
    'getClaims',
    function (
      this: FastifyRequest,
      instance: FastifyInstance,
    ): TResult<VerifyPayloadType> {
      if (!this.headers.authorization) {
        return Err(`no Authorization header found`);
      }
      if (!this.headers.authorization.startsWith('Bearer ')) {
        return Err(`Authorization does not include 'Bearer' signature`);
      }
      const token = this.headers.authorization?.split('Bearer ')[1];
      const claims = instance.jwt.verify(token);
      return Val(claims);
    },
  );
}

export function fastifyInstance(instance: FastifyInstance) {
  instance.decorate(
    'validateRole',
    (role: string, req: FastifyRequest): TResult<TVoid> => {
      try {
        const hashJwt = req.headers.authorization?.split('Bearer ')[1];
        if (!hashJwt) {
          return Err('no jwt found in header');
        }
        const claims = instance.jwt.verify(hashJwt) as SI.IClaims;
        if (claims.role !== role) {
          return Err('role not found in claim');
        }
        return OK();
      } catch (error) {
        if (error instanceof Error) {
          Err(error.message);
        }
        return Err('unknown error');
      }
    },
  );
}

declare global {
  interface Date {
    toUTC(): Date;
  }
}

Date.prototype.toUTC = function (): Date {
  return new Date(
    Date.UTC(
      this.getUTCFullYear(),
      this.getUTCMonth(),
      this.getUTCDate(),
      this.getUTCHours(),
      this.getUTCMinutes(),
      this.getUTCSeconds(),
      this.getUTCMilliseconds(),
    ),
  );
};
