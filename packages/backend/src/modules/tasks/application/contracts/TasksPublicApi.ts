import type { TaskDTO } from '../dto';

export interface TasksPublicApi {
      ensureTaskExists(taskId: string): Promise<void>;
      ensureUserCanAccessTask(taskId: string, userId: string): Promise<void>;
      getTaskById(taskId: string): Promise<TaskDTO | null>;
}
