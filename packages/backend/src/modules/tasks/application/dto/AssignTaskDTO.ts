import type { TaskDTO } from './TaskDTO';

export interface AssignTaskInputDTO {
      actorId: string;
      taskId: string;
      assigneeId: string;
}

export interface AssignTaskOutputDTO {
      task: TaskDTO;
}

export interface UnassignTaskInputDTO {
      actorId: string;
      taskId: string;
}

export interface UnassignTaskOutputDTO {
      task: TaskDTO;
}
