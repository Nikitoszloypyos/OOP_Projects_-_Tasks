import type { CommentDTO } from './CommentDTO';

export interface AddCommentInputDTO {
      actorId: string;
      taskId: string;
      text: string;
}

export interface AddCommentOutputDTO {
      comment: CommentDTO;
}
