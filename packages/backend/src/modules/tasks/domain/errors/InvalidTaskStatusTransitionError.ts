import { ValidationError } from '../../../../shared/domain/errors';

export class InvalidTaskStatusTransitionError extends ValidationError {
      constructor(message = 'Task status transition is invalid') {
            super(message);
      }
}
