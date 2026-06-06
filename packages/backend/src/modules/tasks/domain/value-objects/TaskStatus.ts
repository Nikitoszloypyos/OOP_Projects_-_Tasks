import { ValidationError } from '../../../../shared/domain/errors';
import { InvalidTaskStatusTransitionError } from '../errors';

export const TASK_STATUSES = ['created', 'in_progress', 'review', 'done'] as const;

export type TaskStatusValue = (typeof TASK_STATUSES)[number];

const ALLOWED_TRANSITIONS: Record<TaskStatusValue, TaskStatusValue[]> = {
      created: ['in_progress'],
      in_progress: ['review'],
      review: ['done', 'in_progress'],
      done: ['in_progress']
};

export class TaskStatus {
      private constructor(private readonly value: TaskStatusValue) {}

      static create(value: string): TaskStatus {
            if (!TASK_STATUSES.includes(value as TaskStatusValue)) {
                  throw new ValidationError(`Unknown task status "${value}"`);
            }

            return new TaskStatus(value as TaskStatusValue);
      }

      static created(): TaskStatus {
            return new TaskStatus('created');
      }

      static inProgress(): TaskStatus {
            return new TaskStatus('in_progress');
      }

      static review(): TaskStatus {
            return new TaskStatus('review');
      }

      static done(): TaskStatus {
            return new TaskStatus('done');
      }

      canTransitionTo(nextStatus: TaskStatus): boolean {
            return ALLOWED_TRANSITIONS[this.value].includes(nextStatus.value);
      }

      transitionTo(nextStatus: TaskStatus): TaskStatus {
            if (!this.canTransitionTo(nextStatus)) {
                  throw new InvalidTaskStatusTransitionError(this.value, nextStatus.value);
            }

            return nextStatus;
      }

      equals(status: TaskStatus): boolean {
            return this.value === status.value;
      }

      getValue(): TaskStatusValue {
            return this.value;
      }
}
