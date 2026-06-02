import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import { tasksRoutes } from './infrastructure/http/tasksRoutes';

export async function registerTasksModule(
      app: FastifyInstance,
      _deps: SharedDeps
): Promise<void> {
      await app.register(tasksRoutes, { prefix: '/tasks' });
}
