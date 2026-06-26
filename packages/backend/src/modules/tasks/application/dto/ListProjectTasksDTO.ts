import type { TaskDTO } from './TaskDTO';

export interface ListProjectTasksRequestDTO {
      projectId: string;
      actorId: string;
}

export interface ListProjectTasksResponseDTO {
      tasks: TaskDTO[];
}
