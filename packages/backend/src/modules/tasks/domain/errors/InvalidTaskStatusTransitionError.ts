import { ValidationError } from '../../../../shared/domain/errors';

export class InvalidTaskStatusTransitionError extends ValidationError {
      constructor(currentStatus: string, nextStatus: string) {
            super(`Cannot change task status from "${currentStatus}" to "${nextStatus}"`);
      }
}
