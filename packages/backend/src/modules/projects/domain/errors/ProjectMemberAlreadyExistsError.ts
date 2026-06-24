import { ValidationError } from '../../../../shared/domain/errors';

export class ProjectMemberAlreadyExistsError extends ValidationError {
      constructor(message = 'Project member already exists') {
            super(message);
      }
}
