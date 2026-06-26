import { ValidationError } from '../../../../shared/domain/errors';

export class ArchivedProjectError extends ValidationError {
      constructor(message = 'Archived project cannot be changed') {
            super(message);
      }
}
