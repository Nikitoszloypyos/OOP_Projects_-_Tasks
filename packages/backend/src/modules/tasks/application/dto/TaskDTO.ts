export interface TaskDTO {
      id: string;
      projectId: string;
      creatorId: string;
      assigneeId: string | null;
      title: string;
      description: string | null;
      status: string;
      priority: string;
      createdAt: string;
      updatedAt: string;
}
