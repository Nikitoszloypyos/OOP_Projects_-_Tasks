import type { PrismaClient } from '@prisma/client';

import type { TaskRepository } from '../../application/ports';
import type { Task } from '../../domain/entities';
import { TaskMapper } from '../mappers';

export class PrismaTaskRepository implements TaskRepository {
      constructor(private readonly prisma: PrismaClient) {}

      async save(task: Task): Promise<void> {
            const data = TaskMapper.toPersistence(task);

            await this.prisma.task.upsert({
                  where: { id: data.id },
                  create: data,
                  update: {
                        assigneeId: data.assigneeId,
                        title: data.title,
                        description: data.description,
                        status: data.status,
                        priority: data.priority,
                        updatedAt: data.updatedAt,
                        isArchived: data.isArchived,
                        archivedAt: data.archivedAt,
                        archivedBy: data.archivedBy
                  }
            });
      }

      async findById(id: string): Promise<Task | null> {
            const record = await this.prisma.task.findUnique({ where: { id } });
            return record ? TaskMapper.toDomain(record) : null;
      }

      async listByProjectId(projectId: string): Promise<Task[]> {
            const records = await this.prisma.task.findMany({
                  where: { projectId },
                  orderBy: { createdAt: 'desc' }
            });

            return records.map(TaskMapper.toDomain);
      }
}
