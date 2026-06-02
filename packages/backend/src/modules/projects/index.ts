import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import { projectsRoutes } from './infrastructure/http/projectsRoutes';

export async function registerProjectsModule(
      app: FastifyInstance,
      _deps: SharedDeps
): Promise<void> {
      await app.register(projectsRoutes, { prefix: '/projects' });
}
