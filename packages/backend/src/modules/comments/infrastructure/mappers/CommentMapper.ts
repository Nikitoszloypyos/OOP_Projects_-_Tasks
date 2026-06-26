import type { Comment as PrismaComment } from '@prisma/client';

import { Comment } from '../../domain/entities';

export class CommentMapper {
      static toDomain(record: PrismaComment): Comment {
            return Comment.rehydrate({
                  id: record.id,
                  taskId: record.taskId,
                  authorId: record.authorId,
                  text: record.text,
                  createdAt: record.createdAt,
                  updatedAt: record.updatedAt
            });
      }

      static toPersistence(comment: Comment) {
            return comment.toSnapshot();
      }
}
