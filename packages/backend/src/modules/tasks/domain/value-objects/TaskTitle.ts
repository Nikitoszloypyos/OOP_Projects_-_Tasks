import { ValidationError } from '../../../../shared/domain/errors';

const MAX_TASK_TITLE_LENGTH = 160;

export class TaskTitle {
      private constructor(private readonly value: string) {}

      static create(value: string): TaskTitle {
            const normalized = value.trim();

            if (!normalized) {
                  throw new ValidationError('Task title is required');
            }

            if (normalized.length > MAX_TASK_TITLE_LENGTH) {
                  throw new ValidationError(
                        `Task title must be at most ${MAX_TASK_TITLE_LENGTH} characters long`
                  );
            }

            return new TaskTitle(normalized);
      }

      getValue(): string {
            return this.value;
      }
}
