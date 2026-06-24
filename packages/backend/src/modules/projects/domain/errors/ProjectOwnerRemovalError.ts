import { ValidationError } from '../../../../shared/domain/errors';

export class ProjectOwnerRemovalError extends ValidationError {
      constructor(message = 'Project owner cannot be removed') {
            super(message);
      }
}
