import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import type { ProjectsPublicApi } from '../projects/application/contracts';
import { createTasksPublicApi } from './application/use-cases';
import type { TasksPublicApi } from './application/contracts';
import type { UsersPublicApi } from '../users/application/contracts';
import {
      ChangeTaskStatusUseCase,
      CreateTaskUseCase,
      ListProjectTasksUseCase
} from './application/use-cases';
import { tasksRoutes } from './infrastructure/http/tasksRoutes';
import { PrismaTaskRepository } from './infrastructure/persistence';

export async function registerTasksModule(
      app: FastifyInstance,
      deps: SharedDeps,
      usersApi: UsersPublicApi,
      projectsApi: ProjectsPublicApi
): Promise<TasksPublicApi> {
      const taskRepository = new PrismaTaskRepository(deps.prisma);

      const createTaskUseCase = new CreateTaskUseCase(
            taskRepository,
            projectsApi,
            usersApi,
            deps.idGenerator,
            deps.clock
      );
      const listProjectTasksUseCase = new ListProjectTasksUseCase(taskRepository, projectsApi);
      const changeTaskStatusUseCase = new ChangeTaskStatusUseCase(
            taskRepository,
            projectsApi,
            deps.clock
      );

      await app.register(tasksRoutes, {
            prefix: '/tasks',
            createTaskUseCase,
            listProjectTasksUseCase,
            changeTaskStatusUseCase
      });

      return createTasksPublicApi(taskRepository, projectsApi);
}
