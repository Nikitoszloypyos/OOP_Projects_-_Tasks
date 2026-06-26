import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import type { TasksPublicApi } from '../tasks/application/contracts';
import { AddCommentUseCase, ListTaskCommentsUseCase } from './application/use-cases';
import { commentsRoutes } from './infrastructure/http/commentsRoutes';
import { PrismaCommentRepository } from './infrastructure/persistence';

export async function registerCommentsModule(
      app: FastifyInstance,
      deps: SharedDeps,
      tasksApi: TasksPublicApi
): Promise<void> {
      const commentRepository = new PrismaCommentRepository(deps.prisma);

      const addCommentUseCase = new AddCommentUseCase(
            commentRepository,
            tasksApi,
            deps.idGenerator,
            deps.clock
      );
      const listTaskCommentsUseCase = new ListTaskCommentsUseCase(commentRepository, tasksApi);

      await app.register(commentsRoutes, {
            prefix: '/comments',
            addCommentUseCase,
            listTaskCommentsUseCase
      });
}
