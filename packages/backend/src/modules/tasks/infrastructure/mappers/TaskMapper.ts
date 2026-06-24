import type { Task as PrismaTask } from '@prisma/client';

import { Task } from '../../domain';

export class TaskMapper {
      static toDomain(record: PrismaTask): Task {
            return Task.rehydrate({
                  id: record.id,
                  projectId: record.projectId,
                  title: record.title,
                  description: record.description,
                  status: record.status,
                  priority: record.priority,
                  creatorId: record.creatorId,
                  assigneeId: record.assigneeId,
                  createdAt: record.createdAt,
                  updatedAt: record.updatedAt,
                  isArchived: record.isArchived,
                  archivedAt: record.archivedAt,
                  archivedBy: record.archivedBy
            });
      }

      static toPersistence(task: Task): PrismaTask {
            return task.toSnapshot();
      }
}
