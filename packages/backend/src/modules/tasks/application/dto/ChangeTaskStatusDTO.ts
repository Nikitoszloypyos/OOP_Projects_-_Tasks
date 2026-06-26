import type { TaskDTO } from './TaskDTO';

export interface ChangeTaskStatusRequestDTO {
      taskId: string;
      actorId: string;
      status: string;
}

export interface ChangeTaskStatusResponseDTO {
      task: TaskDTO;
}
