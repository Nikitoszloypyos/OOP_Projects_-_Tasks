import { ValidationError } from '../../../../shared/domain/errors';

export class ArchivedTaskError extends ValidationError {
      constructor(message = 'Archived task cannot be changed') {
            super(message);
      }
}
