import type { Task as PrismaTask } from '@prisma/client';

import { Task } from '../../domain/entities';

export class TaskMapper {
      static toDomain(record: PrismaTask): Task {
            return Task.rehydrate({
                  id: record.id,
                  projectId: record.projectId,
                  creatorId: record.creatorId,
                  assigneeId: record.assigneeId,
                  title: record.title,
                  description: record.description,
                  status: record.status,
                  priority: record.priority,
                  createdAt: record.createdAt,
                  updatedAt: record.updatedAt,
                  isArchived: record.isArchived,
                  archivedAt: record.archivedAt,
                  archivedBy: record.archivedBy
            });
      }

      static toPersistence(task: Task) {
            return task.toSnapshot();
      }
}
