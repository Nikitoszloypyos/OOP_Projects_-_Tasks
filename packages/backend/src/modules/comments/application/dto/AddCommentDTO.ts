import type { CommentDTO } from './CommentDTO';

export interface AddCommentRequestDTO {
      actorId: string;
      taskId: string;
      text: string;
}

export interface AddCommentResponseDTO {
      comment: CommentDTO;
}
