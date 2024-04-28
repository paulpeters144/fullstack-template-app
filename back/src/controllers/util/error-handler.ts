import { FastifyError, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import { BadRequestError } from '../../utils/errors';
import { SI, SV } from '../../../../shared/types';

export const getError = (reply: FastifyReply, error: unknown): FastifyReply => {
  try {
    if (error instanceof ZodError) {
      const err = SV.zodErrorMessages(error);
      const message: SV.ModelErrors<unknown> = { error: err.model };
      return reply.code(400).send(message);
    }
    if (error instanceof BadRequestError) {
      const message: SI.IFriendlyError = { error: error.message };
      return reply.code(400).send(message);
    }
    if (isFastifyError(error)) {
      const fastifyError = error as FastifyError;
      return handleFastifyError(reply, fastifyError);
    }
  } catch (error) {
    console.log(error);
  }

  const message: SI.IFriendlyError = { error: 'Internal Server Error' };
  return reply.code(500).send(message);
};

function isFastifyError(obj: unknown): boolean {
  if (!(obj instanceof Error)) return false;
  const error = obj as FastifyError;
  if (!error.code) return false;
  if (!error.name) return false;
  if (!error.statusCode) return false;
  return true;
}
function handleFastifyError(reply: FastifyReply, error: FastifyError) {
  const message: SI.IFriendlyError = { error: error.message };
  return reply.code(error.statusCode || 500).send(message);
}
