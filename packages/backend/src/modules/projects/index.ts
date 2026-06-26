import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import { createProjectsPublicApi } from './application/use-cases';
import type { ProjectsPublicApi } from './application/contracts';
import type { UsersPublicApi } from '../users/application/contracts';
import {
      AddProjectMemberUseCase,
      CreateProjectUseCase,
      ListProjectMembersUseCase,
      ListUserProjectsUseCase
} from './application/use-cases';
import { projectsRoutes } from './infrastructure/http/projectsRoutes';
import {
      PrismaProjectMemberRepository,
      PrismaProjectRepository
} from './infrastructure/persistence';

export async function registerProjectsModule(
      app: FastifyInstance,
      deps: SharedDeps,
      usersApi: UsersPublicApi
): Promise<ProjectsPublicApi> {
      const projectRepository = new PrismaProjectRepository(deps.prisma);
      const projectMemberRepository = new PrismaProjectMemberRepository(deps.prisma);

      const createProjectUseCase = new CreateProjectUseCase(
            projectRepository,
            projectMemberRepository,
            usersApi,
            deps.idGenerator,
            deps.clock
      );
      const listUserProjectsUseCase = new ListUserProjectsUseCase(projectRepository);
      const listProjectMembersUseCase = new ListProjectMembersUseCase(
            projectRepository,
            projectMemberRepository
      );
      const addProjectMemberUseCase = new AddProjectMemberUseCase(
            projectRepository,
            projectMemberRepository,
            usersApi,
            deps.idGenerator,
            deps.clock
      );

      await app.register(projectsRoutes, {
            prefix: '/projects',
            createProjectUseCase,
            listUserProjectsUseCase,
            listProjectMembersUseCase,
            addProjectMemberUseCase
      });

      return createProjectsPublicApi(projectRepository, projectMemberRepository);
}
