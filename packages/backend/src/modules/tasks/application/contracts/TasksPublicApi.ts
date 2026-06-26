export interface TasksPublicApi {
      ensureTaskExists(taskId: string): Promise<void>;
      ensureUserCanAccessTask(taskId: string, userId: string): Promise<void>;
}
