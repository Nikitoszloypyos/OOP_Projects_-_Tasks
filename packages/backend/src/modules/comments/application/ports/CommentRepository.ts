import type { Comment } from '../../domain';

export interface ListTaskCommentsOptions {
      includeDeleted?: boolean;
}

export interface CommentRepository {
      save(comment: Comment): Promise<void>;
      findById(id: string): Promise<Comment | null>;
      listByTaskId(taskId: string, options?: ListTaskCommentsOptions): Promise<Comment[]>;
}
