import { ValidationError } from '../../../../shared/domain/errors';

export type TaskPriorityValue = 'low' | 'medium' | 'high';

export class TaskPriority {
      private constructor(private readonly value: TaskPriorityValue) {}

      static create(value: string): TaskPriority {
            if (value !== 'low' && value !== 'medium' && value !== 'high') {
                  throw new ValidationError('Task priority is invalid');
            }

            return new TaskPriority(value);
      }

      static medium(): TaskPriority {
            return new TaskPriority('medium');
      }

      getValue(): TaskPriorityValue {
            return this.value;
      }
}
