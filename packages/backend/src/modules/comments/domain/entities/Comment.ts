import { CommentText } from '../value-objects/CommentText';

export interface CreateCommentProps {
      id: string;
      taskId: string;
      authorId: string;
      text: string;
      createdAt: Date;
}

export interface RehydrateCommentProps {
      id: string;
      taskId: string;
      authorId: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
}

export interface CommentSnapshot {
      id: string;
      taskId: string;
      authorId: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
}

export class Comment {
      private constructor(
            private readonly id: string,
            private readonly taskId: string,
            private readonly authorId: string,
            private text: CommentText,
            private readonly createdAt: Date,
            private updatedAt: Date
      ) {}

      static create(props: CreateCommentProps): Comment {
            return new Comment(
                  props.id,
                  props.taskId,
                  props.authorId,
                  CommentText.create(props.text),
                  props.createdAt,
                  props.createdAt
            );
      }

      static rehydrate(props: RehydrateCommentProps): Comment {
            return new Comment(
                  props.id,
                  props.taskId,
                  props.authorId,
                  CommentText.create(props.text),
                  props.createdAt,
                  props.updatedAt
            );
      }

      toSnapshot(): CommentSnapshot {
            return {
                  id: this.id,
                  taskId: this.taskId,
                  authorId: this.authorId,
                  text: this.text.getValue(),
                  createdAt: this.createdAt,
                  updatedAt: this.updatedAt
            };
      }
}
