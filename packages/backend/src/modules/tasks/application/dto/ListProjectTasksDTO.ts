import type { TaskDTO } from './TaskDTO';

export interface ListProjectTasksInputDTO {
      actorId: string;
      projectId: string;
      includeArchived?: boolean;
}

export interface ListProjectTasksOutputDTO {
      tasks: TaskDTO[];
}
