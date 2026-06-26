import { ValidationError } from '../../../../shared/domain/errors';

const MAX_PROJECT_DESCRIPTION_LENGTH = 2000;

export class ProjectDescription {
      private constructor(private readonly value: string | null) {}

      static create(value?: string | null): ProjectDescription {
            const normalized = value?.trim() ?? null;

            if (normalized && normalized.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
                  throw new ValidationError(
                        `Project description must be at most ${MAX_PROJECT_DESCRIPTION_LENGTH} characters long`
                  );
            }

            return new ProjectDescription(normalized || null);
      }

      getValue(): string | null {
            return this.value;
      }
}
