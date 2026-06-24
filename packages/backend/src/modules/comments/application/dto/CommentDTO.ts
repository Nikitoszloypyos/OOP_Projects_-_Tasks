import type { Comment, CommentSnapshot } from '../../domain';

export interface CommentDTO {
      id: string;
      taskId: string;
      authorId: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      isDeleted: boolean;
      deletedAt: string | null;
      deletedBy: string | null;
}

export function toCommentDTO(comment: Comment): CommentDTO {
      return commentSnapshotToDTO(comment.toSnapshot());
}

export function commentSnapshotToDTO(snapshot: CommentSnapshot): CommentDTO {
      return {
            id: snapshot.id,
            taskId: snapshot.taskId,
            authorId: snapshot.authorId,
            text: snapshot.text,
            createdAt: snapshot.createdAt.toISOString(),
            updatedAt: snapshot.updatedAt.toISOString(),
            isDeleted: snapshot.isDeleted,
            deletedAt: snapshot.deletedAt?.toISOString() ?? null,
            deletedBy: snapshot.deletedBy
      };
}
