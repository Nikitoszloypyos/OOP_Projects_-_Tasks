import { ValidationError } from '../../../../shared/domain/errors';

const MAX_PROJECT_NAME_LENGTH = 120;

export class ProjectName {
      private constructor(private readonly value: string) {}

      static create(value: string): ProjectName {
            const name = value.trim();

            if (name.length === 0) {
                  throw new ValidationError('Project name cannot be empty');
            }

            if (name.length > MAX_PROJECT_NAME_LENGTH) {
                  throw new ValidationError(
                        `Project name cannot be longer than ${MAX_PROJECT_NAME_LENGTH} characters`
                  );
            }

            return new ProjectName(name);
      }

      getValue(): string {
            return this.value;
      }
}
