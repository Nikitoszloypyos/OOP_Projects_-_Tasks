import { ForbiddenError, NotFoundError } from '../../../../shared/domain/errors';
import type { ProjectsPublicApi } from '../../../projects/application/contracts';
import type { TasksPublicApi } from '../contracts';
import type { TaskRepository } from '../ports';

export function createTasksPublicApi(
      taskRepository: TaskRepository,
      projectsApi: ProjectsPublicApi
): TasksPublicApi {
      return {
            async ensureTaskExists(taskId: string): Promise<void> {
                  const task = await taskRepository.findById(taskId);

                  if (!task) {
                        throw new NotFoundError('Task not found');
                  }
            },
            async ensureUserCanAccessTask(taskId: string, userId: string): Promise<void> {
                  const task = await taskRepository.findById(taskId);

                  if (!task) {
                        throw new NotFoundError('Task not found');
                  }

                  await projectsApi.ensureUserIsProjectMember(task.toSnapshot().projectId, userId);
            }
      };
}
