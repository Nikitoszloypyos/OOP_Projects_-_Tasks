import type { TaskPriorityValue } from '../../domain';
import type { TaskDTO } from './TaskDTO';

export interface CreateTaskInputDTO {
      actorId: string;
      projectId: string;
      title: string;
      description?: string | null;
      assigneeId?: string | null;
      priority?: TaskPriorityValue;
}

export interface CreateTaskOutputDTO {
      task: TaskDTO;
}
