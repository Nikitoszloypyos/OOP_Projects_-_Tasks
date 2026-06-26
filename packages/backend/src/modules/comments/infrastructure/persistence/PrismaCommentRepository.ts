import type { PrismaClient } from '@prisma/client';

import type { CommentRepository } from '../../application/ports';
import type { Comment } from '../../domain/entities';
import { CommentMapper } from '../mappers';

export class PrismaCommentRepository implements CommentRepository {
      constructor(private readonly prisma: PrismaClient) {}

      async save(comment: Comment): Promise<void> {
            const data = CommentMapper.toPersistence(comment);

            await this.prisma.comment.create({
                  data
            });
      }

      async listByTaskId(taskId: string): Promise<Comment[]> {
            const records = await this.prisma.comment.findMany({
                  where: { taskId },
                  orderBy: { createdAt: 'asc' }
            });

            return records.map(CommentMapper.toDomain);
      }
}
