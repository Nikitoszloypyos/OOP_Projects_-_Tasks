import { AuthError } from '../../../../shared/domain/errors';

export class InvalidCredentialsError extends AuthError {
      constructor(message = 'Invalid user credentials') {
            super(message);
      }
}
