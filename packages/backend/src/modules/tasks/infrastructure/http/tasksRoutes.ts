import type { FastifyPluginAsync } from 'fastify';

export const tasksRoutes: FastifyPluginAsync = async (app) => {
      app.get('/health', async () => ({
            module: 'tasks',
            status: 'ready'
      }));
};
