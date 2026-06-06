import { ValidationError } from '../../../../shared/domain/errors';
import { ArchivedTaskError } from '../errors';
import {
      TaskDescription,
      TaskPriority,
      TaskPriorityValue,
      TaskStatus,
      TaskStatusValue,
      TaskTitle
} from '../value-objects';

export interface CreateTaskParams {
      id: string;
      projectId: string;
      title: string;
      description?: string | null;
      creatorId: string;
      assigneeId?: string | null;
      priority?: TaskPriorityValue;
      createdAt: Date;
}

export interface RehydrateTaskParams {
      id: string;
      projectId: string;
      title: string;
      description?: string | null;
      status: TaskStatusValue;
      priority: TaskPriorityValue;
      creatorId: string;
      assigneeId: string | null;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

export interface TaskSnapshot {
      id: string;
      projectId: string;
      title: string;
      description: string;
      status: TaskStatusValue;
      priority: TaskPriorityValue;
      creatorId: string;
      assigneeId: string | null;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

interface TaskProps {
      id: string;
      projectId: string;
      title: TaskTitle;
      description: TaskDescription;
      status: TaskStatus;
      priority: TaskPriority;
      creatorId: string;
      assigneeId: string | null;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

export class Task {
      private constructor(private readonly props: TaskProps) {
            this.assertRequiredId(props.id, 'Task id');
            this.assertRequiredId(props.projectId, 'Project id');
            this.assertRequiredId(props.creatorId, 'Creator id');

            if (props.assigneeId !== null) {
                  this.assertRequiredId(props.assigneeId, 'Assignee id');
            }
      }

      static create(params: CreateTaskParams): Task {
            return new Task({
                  id: params.id,
                  projectId: params.projectId,
                  title: TaskTitle.create(params.title),
                  description: TaskDescription.create(params.description),
                  status: TaskStatus.created(),
                  priority: params.priority ? TaskPriority.create(params.priority) : TaskPriority.medium(),
                  creatorId: params.creatorId,
                  assigneeId: params.assigneeId ?? null,
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.createdAt),
                  isArchived: false,
                  archivedAt: null,
                  archivedBy: null
            });
      }

      static rehydrate(params: RehydrateTaskParams): Task {
            return new Task({
                  id: params.id,
                  projectId: params.projectId,
                  title: TaskTitle.create(params.title),
                  description: TaskDescription.create(params.description),
                  status: TaskStatus.create(params.status),
                  priority: TaskPriority.create(params.priority),
                  creatorId: params.creatorId,
                  assigneeId: params.assigneeId,
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.updatedAt),
                  isArchived: params.isArchived,
                  archivedAt: params.archivedAt ? cloneDate(params.archivedAt) : null,
                  archivedBy: params.archivedBy
            });
      }

      rename(title: string, updatedAt: Date): void {
            this.assertActive();
            this.props.title = TaskTitle.create(title);
            this.touch(updatedAt);
      }

      updateDescription(description: string | null | undefined, updatedAt: Date): void {
            this.assertActive();
            this.props.description = TaskDescription.create(description);
            this.touch(updatedAt);
      }

      changePriority(priority: TaskPriorityValue, updatedAt: Date): void {
            this.assertActive();
            this.props.priority = TaskPriority.create(priority);
            this.touch(updatedAt);
      }

      changeStatus(status: TaskStatusValue, updatedAt: Date): void {
            this.assertActive();
            this.props.status = this.props.status.transitionTo(TaskStatus.create(status));
            this.touch(updatedAt);
      }

      assignTo(userId: string, updatedAt: Date): void {
            this.assertActive();
            this.assertRequiredId(userId, 'Assignee id');
            this.props.assigneeId = userId;
            this.touch(updatedAt);
      }

      unassign(updatedAt: Date): void {
            this.assertActive();
            this.props.assigneeId = null;
            this.touch(updatedAt);
      }

      archive(actorId: string, archivedAt: Date): void {
            this.assertRequiredId(actorId, 'Archive actor id');

            if (this.props.isArchived) {
                  throw new ArchivedTaskError('Task is already archived');
            }

            this.props.isArchived = true;
            this.props.archivedAt = cloneDate(archivedAt);
            this.props.archivedBy = actorId;
            this.touch(archivedAt);
      }

      toSnapshot(): TaskSnapshot {
            return {
                  id: this.props.id,
                  projectId: this.props.projectId,
                  title: this.props.title.getValue(),
                  description: this.props.description.getValue(),
                  status: this.props.status.getValue(),
                  priority: this.props.priority.getValue(),
                  creatorId: this.props.creatorId,
                  assigneeId: this.props.assigneeId,
                  createdAt: cloneDate(this.props.createdAt),
                  updatedAt: cloneDate(this.props.updatedAt),
                  isArchived: this.props.isArchived,
                  archivedAt: this.props.archivedAt ? cloneDate(this.props.archivedAt) : null,
                  archivedBy: this.props.archivedBy
            };
      }

      private touch(updatedAt: Date): void {
            this.props.updatedAt = cloneDate(updatedAt);
      }

      private assertActive(): void {
            if (this.props.isArchived) {
                  throw new ArchivedTaskError();
            }
      }

      private assertRequiredId(value: string, label: string): void {
            if (value.trim().length === 0) {
                  throw new ValidationError(`${label} cannot be empty`);
            }
      }
}

function cloneDate(date: Date): Date {
      return new Date(date);
}
