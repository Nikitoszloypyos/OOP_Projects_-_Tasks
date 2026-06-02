import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import { usersRoutes } from './infrastructure/http/usersRoutes';

export async function registerUsersModule(
      app: FastifyInstance,
      _deps: SharedDeps
): Promise<void> {
      await app.register(usersRoutes, { prefix: '/users' });
}
