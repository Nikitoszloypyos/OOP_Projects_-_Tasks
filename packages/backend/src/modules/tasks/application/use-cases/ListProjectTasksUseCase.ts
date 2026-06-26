import type { ListProjectTasksRequestDTO, ListProjectTasksResponseDTO } from '../dto';
import type { ProjectAccessPort, TaskRepository } from '../ports';
import { taskToDto } from './taskToDto';

export class ListProjectTasksUseCase {
      constructor(
            private readonly taskRepository: TaskRepository,
            private readonly projectAccess: ProjectAccessPort
      ) {}

      async execute(input: ListProjectTasksRequestDTO): Promise<ListProjectTasksResponseDTO> {
            await this.projectAccess.ensureProjectExists(input.projectId);
            await this.projectAccess.ensureUserIsProjectMember(input.projectId, input.actorId);

            const tasks = await this.taskRepository.listByProjectId(input.projectId);

            return {
                  tasks: tasks.map(taskToDto)
            };
      }
}
