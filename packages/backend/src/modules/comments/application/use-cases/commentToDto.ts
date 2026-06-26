import type { Comment } from '../../domain/entities';
import type { CommentDTO } from '../dto';

export function commentToDto(comment: Comment): CommentDTO {
      const snapshot = comment.toSnapshot();

      return {
            id: snapshot.id,
            taskId: snapshot.taskId,
            authorId: snapshot.authorId,
            text: snapshot.text,
            createdAt: snapshot.createdAt.toISOString(),
            updatedAt: snapshot.updatedAt.toISOString()
      };
}
