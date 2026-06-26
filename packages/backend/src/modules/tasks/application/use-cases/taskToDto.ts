import type { Task } from '../../domain/entities';
import type { TaskDTO } from '../dto';

export function taskToDto(task: Task): TaskDTO {
      const snapshot = task.toSnapshot();

      return {
            id: snapshot.id,
            projectId: snapshot.projectId,
            creatorId: snapshot.creatorId,
            assigneeId: snapshot.assigneeId,
            title: snapshot.title,
            description: snapshot.description,
            status: snapshot.status,
            priority: snapshot.priority,
            createdAt: snapshot.createdAt.toISOString(),
            updatedAt: snapshot.updatedAt.toISOString()
      };
}
