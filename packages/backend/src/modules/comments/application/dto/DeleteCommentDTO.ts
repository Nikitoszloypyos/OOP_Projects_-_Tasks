import type { CommentDTO } from './CommentDTO';

export interface DeleteCommentInputDTO {
      actorId: string;
      commentId: string;
}

export interface DeleteCommentOutputDTO {
      comment: CommentDTO;
}
