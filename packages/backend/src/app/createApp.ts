import fastify, { FastifyInstance } from 'fastify';

import { registerModules } from './registerModules';
import { createSharedDeps } from './createSharedDeps';
import { AppError } from '../shared/domain/errors';
import type { CreateAppOptions } from './types';

export async function createApp(options: CreateAppOptions = {}): Promise<FastifyInstance> {
      const app = fastify({ logger: true });
      const deps = createSharedDeps();

      app.get('/health', async () => ({
            status: 'ok',
            modules: options.enabledModules ?? 'all'
      }));

      await registerModules(app, deps, options.enabledModules);

      app.setErrorHandler((error, request, reply) => {
            request.log.error(error);

            if (error instanceof AppError) {
                  reply.status(error.statusCode).send({
                        code: error.code,
                        message: error.message
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
