import type { FastifyPluginAsync } from 'fastify';

export const usersRoutes: FastifyPluginAsync = async (app) => {
      app.get('/health', async () => ({
            module: 'users',
            status: 'ready'
      }));
};
