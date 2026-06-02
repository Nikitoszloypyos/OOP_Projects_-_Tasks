import { AppError } from './AppError';

export class ValidationError extends AppError {
      constructor(message = 'Validation error') {
            super('VALIDATION_ERROR', message, 400);
      }
}
