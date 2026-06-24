import type { Task, TaskSnapshot } from '../../domain';
import type { TaskPriorityValue, TaskStatusValue } from '../../domain';

export interface TaskDTO {
      id: string;
      projectId: string;
      title: string;
      description: string;
      status: TaskStatusValue;
      priority: TaskPriorityValue;
      creatorId: string;
      assigneeId: string | null;
      createdAt: string;
      updatedAt: string;
      isArchived: boolean;
      archivedAt: string | null;
      archivedBy: string | null;
}

export function toTaskDTO(task: Task): TaskDTO {
      return taskSnapshotToDTO(task.toSnapshot());
}

export function taskSnapshotToDTO(snapshot: TaskSnapshot): TaskDTO {
      return {
            id: snapshot.id,
            projectId: snapshot.projectId,
            title: snapshot.title,
            description: snapshot.description,
            status: snapshot.status,
            priority: snapshot.priority,
            creatorId: snapshot.creatorId,
            assigneeId: snapshot.assigneeId,
            createdAt: snapshot.createdAt.toISOString(),
            updatedAt: snapshot.updatedAt.toISOString(),
            isArchived: snapshot.isArchived,
            archivedAt: snapshot.archivedAt?.toISOString() ?? null,
            archivedBy: snapshot.archivedBy
      };
}
