import type { TaskDTO } from './TaskDTO';

export interface GetTaskInputDTO {
      actorId: string;
      taskId: string;
}

export interface GetTaskOutputDTO {
      task: TaskDTO;
}
