import { AppError } from './AppError';

export class AuthError extends AppError {
      constructor(message = 'Authentication required') {
            super('AUTH_ERROR', message, 401);
      }
}
