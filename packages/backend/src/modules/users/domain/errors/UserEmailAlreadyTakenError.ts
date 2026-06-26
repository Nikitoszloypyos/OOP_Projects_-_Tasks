import { ValidationError } from '../../../../shared/domain/errors';

export class UserEmailAlreadyTakenError extends ValidationError {
      constructor(message = 'Email is already taken') {
            super(message);
      }
}
