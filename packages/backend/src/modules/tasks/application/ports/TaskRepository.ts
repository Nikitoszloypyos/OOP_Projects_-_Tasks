import type { Task } from '../../domain';

export interface ListProjectTasksOptions {
      includeArchived?: boolean;
}

export interface TaskRepository {
      save(task: Task): Promise<void>;
      findById(id: string): Promise<Task | null>;
      listByProjectId(projectId: string, options?: ListProjectTasksOptions): Promise<Task[]>;
}
