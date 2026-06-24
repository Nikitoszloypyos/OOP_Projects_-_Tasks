import type { PrismaClient } from '@prisma/client';

import type { ListProjectTasksOptions, TaskRepository } from '../../application/ports';
import type { Task } from '../../domain';
import { TaskMapper } from '../mappers';

export class PrismaTaskRepository implements TaskRepository {
      constructor(private readonly prisma: PrismaClient) {}

      async save(task: Task): Promise<void> {
            const { id, ...data } = TaskMapper.toPersistence(task);

            await this.prisma.task.upsert({
                  where: { id },
                  create: {
                        id,
                        ...data
                  },
                  update: data
            });
      }

      async findById(id: string): Promise<Task | null> {
            const task = await this.prisma.task.findUnique({
                  where: { id }
            });

            return task ? TaskMapper.toDomain(task) : null;
      }

      async listByProjectId(
            projectId: string,
            options: ListProjectTasksOptions = {}
      ): Promise<Task[]> {
            const tasks = await this.prisma.task.findMany({
                  where: {
                        projectId,
                        ...(options.includeArchived ? {} : { isArchived: false })
                  },
                  orderBy: {
                        createdAt: 'asc'
                  }
            });

            return tasks.map(TaskMapper.toDomain);
      }
}
