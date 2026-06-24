import type { TaskStatusValue } from '../../domain';
import type { TaskDTO } from './TaskDTO';

export interface ChangeTaskStatusInputDTO {
      actorId: string;
      taskId: string;
      status: TaskStatusValue;
}

export interface ChangeTaskStatusOutputDTO {
      task: TaskDTO;
}
