import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import { commentsRoutes } from './infrastructure/http/commentsRoutes';

export async function registerCommentsModule(
      app: FastifyInstance,
      _deps: SharedDeps
): Promise<void> {
      await app.register(commentsRoutes, { prefix: '/comments' });
}
