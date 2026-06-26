import type { Comment } from '../../domain/entities';

export interface CommentRepository {
      save(comment: Comment): Promise<void>;
      listByTaskId(taskId: string): Promise<Comment[]>;
}
