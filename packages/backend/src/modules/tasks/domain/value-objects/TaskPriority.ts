import { ValidationError } from '../../../../shared/domain/errors';

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export type TaskPriorityValue = (typeof TASK_PRIORITIES)[number];

export class TaskPriority {
      private constructor(private readonly value: TaskPriorityValue) {}

      static create(value: string): TaskPriority {
            if (!TASK_PRIORITIES.includes(value as TaskPriorityValue)) {
                  throw new ValidationError(`Unknown task priority "${value}"`);
            }

            return new TaskPriority(value as TaskPriorityValue);
      }

      static low(): TaskPriority {
            return new TaskPriority('low');
      }

      static medium(): TaskPriority {
            return new TaskPriority('medium');
      }

      static high(): TaskPriority {
            return new TaskPriority('high');
      }

      getValue(): TaskPriorityValue {
            return this.value;
      }
}
