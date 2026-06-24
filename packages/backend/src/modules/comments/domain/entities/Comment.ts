import { ValidationError } from '../../../../shared/domain/errors';
import { CommentAuthorMismatchError, DeletedCommentError } from '../errors';
import { CommentText } from '../value-objects';

export interface CreateCommentParams {
      id: string;
      taskId: string;
      authorId: string;
      text: string;
      createdAt: Date;
}

export interface RehydrateCommentParams {
      id: string;
      taskId: string;
      authorId: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
      isDeleted: boolean;
      deletedAt: Date | null;
      deletedBy: string | null;
}

export interface CommentSnapshot {
      id: string;
      taskId: string;
      authorId: string;
      text: string;
      createdAt: Date;
      updatedAt: Date;
      isDeleted: boolean;
      deletedAt: Date | null;
      deletedBy: string | null;
}

interface CommentProps {
      id: string;
      taskId: string;
      authorId: string;
      text: CommentText;
      createdAt: Date;
      updatedAt: Date;
      isDeleted: boolean;
      deletedAt: Date | null;
      deletedBy: string | null;
}

export class Comment {
      private constructor(private readonly props: CommentProps) {
            this.assertRequiredId(props.id, 'Comment id');
            this.assertRequiredId(props.taskId, 'Task id');
            this.assertRequiredId(props.authorId, 'Author id');

            if (props.deletedBy !== null) {
                  this.assertRequiredId(props.deletedBy, 'Delete actor id');
            }
      }

      static create(params: CreateCommentParams): Comment {
            return new Comment({
                  id: params.id,
                  taskId: params.taskId,
                  authorId: params.authorId,
                  text: CommentText.create(params.text),
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.createdAt),
                  isDeleted: false,
                  deletedAt: null,
                  deletedBy: null
            });
      }

      static rehydrate(params: RehydrateCommentParams): Comment {
            return new Comment({
                  id: params.id,
                  taskId: params.taskId,
                  authorId: params.authorId,
                  text: CommentText.create(params.text),
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.updatedAt),
                  isDeleted: params.isDeleted,
                  deletedAt: params.deletedAt ? cloneDate(params.deletedAt) : null,
                  deletedBy: params.deletedBy
            });
      }

      edit(actorId: string, text: string, updatedAt: Date): void {
            this.assertAuthor(actorId);
            this.assertNotDeleted();
            this.props.text = CommentText.create(text);
            this.touch(updatedAt);
      }

      delete(actorId: string, deletedAt: Date): void {
            this.assertAuthor(actorId);

            if (this.props.isDeleted) {
                  throw new DeletedCommentError('Comment is already deleted');
            }

            this.props.isDeleted = true;
            this.props.deletedAt = cloneDate(deletedAt);
            this.props.deletedBy = actorId;
            this.touch(deletedAt);
      }

      toSnapshot(): CommentSnapshot {
            return {
                  id: this.props.id,
                  taskId: this.props.taskId,
                  authorId: this.props.authorId,
                  text: this.props.text.getValue(),
                  createdAt: cloneDate(this.props.createdAt),
                  updatedAt: cloneDate(this.props.updatedAt),
                  isDeleted: this.props.isDeleted,
                  deletedAt: this.props.deletedAt ? cloneDate(this.props.deletedAt) : null,
                  deletedBy: this.props.deletedBy
            };
      }

      private touch(updatedAt: Date): void {
            this.props.updatedAt = cloneDate(updatedAt);
      }

      private assertAuthor(actorId: string): void {
            this.assertRequiredId(actorId, 'Actor id');

            if (actorId !== this.props.authorId) {
                  throw new CommentAuthorMismatchError();
            }
      }

      private assertNotDeleted(): void {
            if (this.props.isDeleted) {
                  throw new DeletedCommentError();
            }
      }

      private assertRequiredId(value: string, label: string): void {
            if (value.trim().length === 0) {
                  throw new ValidationError(`${label} cannot be empty`);
            }
      }
}

function cloneDate(date: Date): Date {
      return new Date(date);
}
