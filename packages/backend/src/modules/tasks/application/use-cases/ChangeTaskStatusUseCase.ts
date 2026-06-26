import type { Clock } from '../../../../shared/application/ports';
import { NotFoundError } from '../../../../shared/domain/errors';
import type { ChangeTaskStatusRequestDTO, ChangeTaskStatusResponseDTO } from '../dto';
import type { ProjectAccessPort, TaskRepository } from '../ports';
import { taskToDto } from './taskToDto';

export class ChangeTaskStatusUseCase {
      constructor(
            private readonly taskRepository: TaskRepository,
            private readonly projectAccess: ProjectAccessPort,
            private readonly clock: Clock
      ) {}

      async execute(input: ChangeTaskStatusRequestDTO): Promise<ChangeTaskStatusResponseDTO> {
            const task = await this.taskRepository.findById(input.taskId);

            if (!task) {
                  throw new NotFoundError('Task not found');
            }

            const snapshot = task.toSnapshot();

            await this.projectAccess.ensureUserIsProjectMember(snapshot.projectId, input.actorId);

            task.changeStatus(input.status, this.clock.now());
            await this.taskRepository.save(task);

            return {
                  task: taskToDto(task)
            };
      }
}
