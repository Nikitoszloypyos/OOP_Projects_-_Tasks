import type { FastifyPluginAsync } from 'fastify';

import type {
      AddProjectMemberUseCase,
      CreateProjectUseCase,
      ListProjectMembersUseCase,
      ListUserProjectsUseCase
} from '../../application/use-cases';
import type {
      AddProjectMemberRequestDTO,
      CreateProjectRequestDTO
} from '../../application/dto';

interface ProjectsRoutesOptions {
      createProjectUseCase: CreateProjectUseCase;
      listUserProjectsUseCase: ListUserProjectsUseCase;
      listProjectMembersUseCase: ListProjectMembersUseCase;
      addProjectMemberUseCase: AddProjectMemberUseCase;
}

export const projectsRoutes: FastifyPluginAsync<ProjectsRoutesOptions> = async (app, options) => {
      app.get('/health', async () => ({
            module: 'projects',
            status: 'ready'
      }));

      app.post('/', async (request, reply) => {
            const body = request.body as CreateProjectRequestDTO;
            const result = await options.createProjectUseCase.execute(body);
            return reply.status(201).send(result);
      });

      app.get('/user/:userId', async (request) => {
            const params = request.params as { userId: string };
            return options.listUserProjectsUseCase.execute({ userId: params.userId });
      });

      app.get('/:projectId/members', async (request) => {
            const params = request.params as { projectId: string };
            const query = request.query as { actorId: string };

            return options.listProjectMembersUseCase.execute({
                  projectId: params.projectId,
                  actorId: query.actorId
            });
      });

      app.post('/:projectId/members', async (request) => {
            const params = request.params as { projectId: string };
            const body = request.body as Omit<AddProjectMemberRequestDTO, 'projectId'>;
            return options.addProjectMemberUseCase.execute({
                  projectId: params.projectId,
                  actorId: body.actorId,
                  userId: body.userId
            });
      });
};
