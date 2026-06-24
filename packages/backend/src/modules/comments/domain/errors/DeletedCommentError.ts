import { ValidationError } from '../../../../shared/domain/errors';

export class DeletedCommentError extends ValidationError {
      constructor(message = 'Deleted comment cannot be modified') {
            super(message);
      }
}
