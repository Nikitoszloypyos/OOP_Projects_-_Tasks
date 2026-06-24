import type { TaskDTO } from './TaskDTO';

export interface ArchiveTaskInputDTO {
      actorId: string;
      taskId: string;
}

export interface ArchiveTaskOutputDTO {
      task: TaskDTO;
}
