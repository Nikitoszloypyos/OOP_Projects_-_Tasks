import { AppError } from './AppError';

export class ForbiddenError extends AppError {
      constructor(message = 'Access denied') {
            super('FORBIDDEN', message, 403);
      }
}
