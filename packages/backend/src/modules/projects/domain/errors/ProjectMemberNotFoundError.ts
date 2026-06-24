import { NotFoundError } from '../../../../shared/domain/errors';

export class ProjectMemberNotFoundError extends NotFoundError {
      constructor(message = 'Project member not found') {
            super(message);
      }
}
