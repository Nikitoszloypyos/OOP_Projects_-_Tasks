import { ValidationError } from '../../../../shared/domain/errors';

const MAX_TASK_DESCRIPTION_LENGTH = 3000;

export class TaskDescription {
      private constructor(private readonly value: string | null) {}

      static create(value?: string | null): TaskDescription {
            const normalized = value?.trim() ?? null;

            if (normalized && normalized.length > MAX_TASK_DESCRIPTION_LENGTH) {
                  throw new ValidationError(
                        `Task description must be at most ${MAX_TASK_DESCRIPTION_LENGTH} characters long`
                  );
            }

            return new TaskDescription(normalized || null);
      }

      getValue(): string | null {
            return this.value;
      }
}
