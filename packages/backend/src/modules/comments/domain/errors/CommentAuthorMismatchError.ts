import { ForbiddenError } from '../../../../shared/domain/errors';

export class CommentAuthorMismatchError extends ForbiddenError {
      constructor(message = 'Only comment author can modify this comment') {
            super(message);
      }
}
