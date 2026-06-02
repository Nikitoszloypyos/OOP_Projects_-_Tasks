import type { FastifyPluginAsync } from 'fastify';

export const projectsRoutes: FastifyPluginAsync = async (app) => {
      app.get('/health', async () => ({
            module: 'projects',
            status: 'ready'
      }));
};
