import type { TaskPriorityValue } from '../../domain';
import type { TaskDTO } from './TaskDTO';

export interface UpdateTaskInputDTO {
      actorId: string;
      taskId: string;
      title?: string;
      description?: string | null;
      priority?: TaskPriorityValue;
}

export interface UpdateTaskOutputDTO {
      task: TaskDTO;
}
