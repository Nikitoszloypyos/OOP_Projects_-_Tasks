import { ValidationError } from '../../../../shared/domain/errors';

export class UserEmailAlreadyTakenError extends ValidationError {
      constructor(message = 'User email is already taken') {
            super(message);
      }
}
