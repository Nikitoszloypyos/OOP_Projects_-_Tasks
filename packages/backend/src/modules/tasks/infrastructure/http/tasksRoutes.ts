import type { FastifyPluginAsync } from 'fastify';

import type {
      ChangeTaskStatusUseCase,
      CreateTaskUseCase,
      ListProjectTasksUseCase
} from '../../application/use-cases';
import type {
      ChangeTaskStatusRequestDTO,
      CreateTaskRequestDTO
} from '../../application/dto';

interface TasksRoutesOptions {
      createTaskUseCase: CreateTaskUseCase;
      listProjectTasksUseCase: ListProjectTasksUseCase;
      changeTaskStatusUseCase: ChangeTaskStatusUseCase;
}

export const tasksRoutes: FastifyPluginAsync<TasksRoutesOptions> = async (app, options) => {
      app.get('/health', async () => ({
            module: 'tasks',
            status: 'ready'
      }));

      app.post('/', async (request, reply) => {
            const body = request.body as CreateTaskRequestDTO;
            const result = await options.createTaskUseCase.execute(body);
            return reply.status(201).send(result);
      });

      app.get('/project/:projectId', async (request) => {
            const params = request.params as { projectId: string };
            const query = request.query as { actorId: string };

            return options.listProjectTasksUseCase.execute({
                  projectId: params.projectId,
                  actorId: query.actorId
            });
      });

      app.patch('/:taskId/status', async (request) => {
            const params = request.params as { taskId: string };
            const body = request.body as Omit<ChangeTaskStatusRequestDTO, 'taskId'>;

            return options.changeTaskStatusUseCase.execute({
                  taskId: params.taskId,
                  actorId: body.actorId,
                  status: body.status
            });
      });
};
