import type { FastifyPluginAsync } from 'fastify';

export const commentsRoutes: FastifyPluginAsync = async (app) => {
      app.get('/health', async () => ({
            module: 'comments',
            status: 'ready'
      }));
};
