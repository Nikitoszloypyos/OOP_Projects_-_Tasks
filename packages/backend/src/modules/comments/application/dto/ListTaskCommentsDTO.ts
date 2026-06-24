import type { CommentDTO } from './CommentDTO';

export interface ListTaskCommentsInputDTO {
      actorId: string;
      taskId: string;
      includeDeleted?: boolean;
}

export interface ListTaskCommentsOutputDTO {
      comments: CommentDTO[];
}
