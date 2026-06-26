import type { FastifyPluginAsync } from 'fastify';

import type { AddCommentUseCase, ListTaskCommentsUseCase } from '../../application/use-cases';
import type { AddCommentRequestDTO } from '../../application/dto';

interface CommentsRoutesOptions {
      addCommentUseCase: AddCommentUseCase;
      listTaskCommentsUseCase: ListTaskCommentsUseCase;
}

export const commentsRoutes: FastifyPluginAsync<CommentsRoutesOptions> = async (app, options) => {
      app.get('/health', async () => ({
            module: 'comments',
            status: 'ready'
      }));

      app.post('/', async (request, reply) => {
            const body = request.body as AddCommentRequestDTO;
            const result = await options.addCommentUseCase.execute(body);
            return reply.status(201).send(result);
      });

      app.get('/task/:taskId', async (request) => {
            const params = request.params as { taskId: string };
            const query = request.query as { actorId: string };

            return options.listTaskCommentsUseCase.execute({
                  taskId: params.taskId,
                  actorId: query.actorId
            });
      });
};
