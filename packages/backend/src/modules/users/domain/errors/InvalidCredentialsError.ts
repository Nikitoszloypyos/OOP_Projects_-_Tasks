import { AuthError } from '../../../../shared/domain/errors';

export class InvalidCredentialsError extends AuthError {
      constructor(message = 'Invalid email or password') {
            super(message);
      }
}
