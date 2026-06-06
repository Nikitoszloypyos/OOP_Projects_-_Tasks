import { ValidationError } from '../../../../shared/domain/errors';

const MAX_TASK_DESCRIPTION_LENGTH = 2_000;

export class TaskDescription {
      private constructor(private readonly value: string) {}

      static create(value?: string | null): TaskDescription {
            const description = value?.trim() ?? '';

            if (description.length > MAX_TASK_DESCRIPTION_LENGTH) {
                  throw new ValidationError(
                        `Task description cannot be longer than ${MAX_TASK_DESCRIPTION_LENGTH} characters`
                  );
            }

            return new TaskDescription(description);
      }

      getValue(): string {
            return this.value;
      }

      isEmpty(): boolean {
            return this.value.length === 0;
      }
}
