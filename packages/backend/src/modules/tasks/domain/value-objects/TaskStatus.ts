import { InvalidTaskStatusTransitionError } from '../errors/InvalidTaskStatusTransitionError';
import { ValidationError } from '../../../../shared/domain/errors';

export type TaskStatusValue = 'created' | 'in_progress' | 'review' | 'done';

const ALLOWED_TRANSITIONS: Record<TaskStatusValue, TaskStatusValue[]> = {
      created: ['in_progress', 'done'],
      in_progress: ['created', 'review', 'done'],
      review: ['created', 'in_progress', 'done'],
      done: ['created', 'in_progress']
};

export class TaskStatus {
      private constructor(private readonly value: TaskStatusValue) {}

      static create(value: string): TaskStatus {
            if (
                  value !== 'created' &&
                  value !== 'in_progress' &&
                  value !== 'review' &&
                  value !== 'done'
            ) {
                  throw new ValidationError('Task status is invalid');
            }

            return new TaskStatus(value);
      }

      static created(): TaskStatus {
            return new TaskStatus('created');
      }

      getValue(): TaskStatusValue {
            return this.value;
      }

      transitionTo(nextStatus: TaskStatus): TaskStatus {
            if (!ALLOWED_TRANSITIONS[this.value].includes(nextStatus.value)) {
                  throw new InvalidTaskStatusTransitionError();
            }

            return nextStatus;
      }
}
