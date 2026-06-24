import { ValidationError } from '../../../../shared/domain/errors';

export class UserAlreadyExistsError extends ValidationError {
      constructor(message = 'User already exists') {
            super(message);
      }
}
