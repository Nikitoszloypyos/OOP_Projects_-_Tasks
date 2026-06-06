import { ValidationError } from '../../../../shared/domain/errors';

const MAX_TASK_TITLE_LENGTH = 120;

export class TaskTitle {
      private constructor(private readonly value: string) {}

      static create(value: string): TaskTitle {
            const title = value.trim();

            if (title.length === 0) {
                  throw new ValidationError('Task title cannot be empty');
            }

            if (title.length > MAX_TASK_TITLE_LENGTH) {
                  throw new ValidationError(
                        `Task title cannot be longer than ${MAX_TASK_TITLE_LENGTH} characters`
                  );
            }

            return new TaskTitle(title);
      }

      getValue(): string {
            return this.value;
      }
}
