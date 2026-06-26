import type { Clock, IdGenerator } from '../../../../shared/application/ports';
import { NotFoundError } from '../../../../shared/domain/errors';
import { Task } from '../../domain/entities';
import type { CreateTaskRequestDTO, CreateTaskResponseDTO } from '../dto';
import type { ProjectAccessPort, TaskRepository, UserLookupPort } from '../ports';
import { taskToDto } from './taskToDto';

export class CreateTaskUseCase {
      constructor(
            private readonly taskRepository: TaskRepository,
            private readonly projectAccess: ProjectAccessPort,
            private readonly userLookup: UserLookupPort,
            private readonly idGenerator: IdGenerator,
            private readonly clock: Clock
      ) {}

      async execute(input: CreateTaskRequestDTO): Promise<CreateTaskResponseDTO> {
            await this.projectAccess.ensureProjectExists(input.projectId);
            await this.projectAccess.ensureUserIsProjectMember(input.projectId, input.actorId);

            if (input.assigneeId) {
                  await this.userLookup.ensureUserExists(input.assigneeId);
                  await this.projectAccess.ensureUserIsProjectMember(
                        input.projectId,
                        input.assigneeId
                  );
            }

            const task = Task.create({
                  id: this.idGenerator.generate(),
                  projectId: input.projectId,
                  creatorId: input.actorId,
                  assigneeId: input.assigneeId,
                  title: input.title,
                  description: input.description,
                  priority: input.priority,
                  createdAt: this.clock.now()
            });

            await this.taskRepository.save(task);

            return {
                  task: taskToDto(task)
            };
      }
}
