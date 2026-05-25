import fastify, { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';

import { AppContext } from '../composition/appContext';
import {
      AppValidationError,
      AuthError,
      ForbiddenError,
      NotFoundError
} from '../../domain/errors';

import { sessionRoutes } from './routes/sessionRoutes';
import { authRoutes } from './routes/authRoutes';
import { habitRoutes } from './routes/habitRoutes';
import { timeEntryRoutes } from './routes/timeEntryRoutes.ts';
import { statsRoutes } from './routes/statsRoutes';

declare module 'fastify' {
      interface FastifyInstance {
            ctx: AppContext;
      }
}

export function createServer(ctx: AppContext): FastifyInstance {
      const app = fastify({ logger: true });

      app.decorate('ctx', ctx);

      app.register(cookie, {
            // можно добавить secret при необходимости
      });

      app.register(cors, {
            origin: true,
            credentials: true
      });

      app.register(sessionRoutes, { prefix: '/session' });
      app.register(authRoutes, { prefix: '/auth' });
      app.register(habitRoutes, { prefix: '/habits' });
      app.register(timeEntryRoutes, { prefix: '/time-entries' });
      app.register(statsRoutes, { prefix: '/stats' });

      app.setErrorHandler((err, request, reply) => {
            request.log.error(err);

            // Fastify валидационные ошибки
            if ((err as any).validation) {
                  reply.status(400).send({
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request',
                        details: (err as any).validation
                  });
                  return;
            }

            if (err instanceof AppValidationError) {
                  reply.status(400).send({
                        code: err.code,
                        message: err.message,
                        field: err.field
                  });
                  return;
            }

            if (err instanceof NotFoundError) {
                  reply.status(404).send({
                        code: err.code,
                        message: err.message
                  });
                  return;
            }

            if (err instanceof ForbiddenError) {
                  reply.status(403).send({
                        code: err.code,
                        message: err.message
                  });
                  return;
            }

            if (err instanceof AuthError) {
                  reply.status(401).send({
                        code: err.code,
                        message: err.message
                  });
                  return;
            }

            reply.status(500).send({
                  code: 'INTERNAL_ERROR',
                  message: 'Internal server error'
            });
      });

      return app;
}
