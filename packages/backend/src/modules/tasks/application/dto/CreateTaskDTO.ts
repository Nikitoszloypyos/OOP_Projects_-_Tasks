import type { TaskDTO } from './TaskDTO';

export interface CreateTaskRequestDTO {
      actorId: string;
      projectId: string;
      assigneeId?: string | null;
      title: string;
      description?: string | null;
      priority?: string;
}

export interface CreateTaskResponseDTO {
      task: TaskDTO;
}
