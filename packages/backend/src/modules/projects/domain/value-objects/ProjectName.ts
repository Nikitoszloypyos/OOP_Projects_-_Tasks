import { ValidationError } from '../../../../shared/domain/errors';

const MAX_PROJECT_NAME_LENGTH = 120;

export class ProjectName {
      private constructor(private readonly value: string) {}

      static create(value: string): ProjectName {
            const normalized = value.trim();

            if (!normalized) {
                  throw new ValidationError('Project name is required');
            }

            if (normalized.length > MAX_PROJECT_NAME_LENGTH) {
                  throw new ValidationError(
                        `Project name must be at most ${MAX_PROJECT_NAME_LENGTH} characters long`
                  );
            }

            return new ProjectName(normalized);
      }

      getValue(): string {
            return this.value;
      }
}
