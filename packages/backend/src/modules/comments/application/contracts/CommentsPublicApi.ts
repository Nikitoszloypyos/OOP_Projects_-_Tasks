import type { CommentDTO } from '../dto';

export interface CommentsPublicApi {
      ensureCommentExists(commentId: string): Promise<void>;
      getCommentById(commentId: string): Promise<CommentDTO | null>;
}
