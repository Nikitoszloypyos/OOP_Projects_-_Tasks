import { ValidationError } from '../../../../shared/domain/errors';

const MAX_PROJECT_DESCRIPTION_LENGTH = 2_000;

export class ProjectDescription {
      private constructor(private readonly value: string) {}

      static create(value?: string | null): ProjectDescription {
            const description = value?.trim() ?? '';

            if (description.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
                  throw new ValidationError(
                        `Project description cannot be longer than ${MAX_PROJECT_DESCRIPTION_LENGTH} characters`
                  );
            }

            return new ProjectDescription(description);
      }

      getValue(): string {
            return this.value;
      }

      isEmpty(): boolean {
            return this.value.length === 0;
      }
}
