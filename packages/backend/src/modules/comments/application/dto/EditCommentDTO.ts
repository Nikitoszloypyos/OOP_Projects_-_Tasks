import type { CommentDTO } from './CommentDTO';

export interface EditCommentInputDTO {
      actorId: string;
      commentId: string;
      text: string;
}

export interface EditCommentOutputDTO {
      comment: CommentDTO;
}
