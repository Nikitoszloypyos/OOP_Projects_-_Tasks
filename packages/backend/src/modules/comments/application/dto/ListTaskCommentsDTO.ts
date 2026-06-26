import type { CommentDTO } from './CommentDTO';

export interface ListTaskCommentsRequestDTO {
      taskId: string;
      actorId: string;
}

export interface ListTaskCommentsResponseDTO {
      comments: CommentDTO[];
}
