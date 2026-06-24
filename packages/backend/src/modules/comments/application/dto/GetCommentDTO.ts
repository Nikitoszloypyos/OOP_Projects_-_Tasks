import type { CommentDTO } from './CommentDTO';

export interface GetCommentInputDTO {
      actorId: string;
      commentId: string;
}

export interface GetCommentOutputDTO {
      comment: CommentDTO;
}
