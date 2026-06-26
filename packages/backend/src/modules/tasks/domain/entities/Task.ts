import { ArchivedTaskError } from '../errors/ArchivedTaskError';
import { TaskDescription } from '../value-objects/TaskDescription';
import { TaskPriority } from '../value-objects/TaskPriority';
import { TaskStatus } from '../value-objects/TaskStatus';
import { TaskTitle } from '../value-objects/TaskTitle';

export interface CreateTaskProps {
      id: string;
      projectId: string;
      creatorId: string;
      title: string;
      description?: string | null;
      priority?: string;
      assigneeId?: string | null;
      createdAt: Date;
}

export interface RehydrateTaskProps {
      id: string;
      projectId: string;
      creatorId: string;
      assigneeId: string | null;
      title: string;
      description: string | null;
      status: string;
      priority: string;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

export interface TaskSnapshot {
      id: string;
      projectId: string;
      creatorId: string;
      assigneeId: string | null;
      title: string;
      description: string | null;
      status: 'created' | 'in_progress' | 'review' | 'done';
      priority: 'low' | 'medium' | 'high';
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

export class Task {
      private constructor(
            private readonly id: string,
            private readonly projectId: string,
            private readonly creatorId: string,
            private assigneeId: string | null,
            private title: TaskTitle,
            private description: TaskDescription,
            private status: TaskStatus,
            private priority: TaskPriority,
            private readonly createdAt: Date,
            private updatedAt: Date,
            private isArchived: boolean,
            private archivedAt: Date | null,
            private archivedBy: string | null
      ) {}

      static create(props: CreateTaskProps): Task {
            return new Task(
                  props.id,
                  props.projectId,
                  props.creatorId,
                  props.assigneeId ?? null,
                  TaskTitle.create(props.title),
                  TaskDescription.create(props.description),
                  TaskStatus.created(),
                  props.priority ? TaskPriority.create(props.priority) : TaskPriority.medium(),
                  props.createdAt,
                  props.createdAt,
                  false,
                  null,
                  null
            );
      }

      static rehydrate(props: RehydrateTaskProps): Task {
            return new Task(
                  props.id,
                  props.projectId,
                  props.creatorId,
                  props.assigneeId,
                  TaskTitle.create(props.title),
                  TaskDescription.create(props.description),
                  TaskStatus.create(props.status),
                  TaskPriority.create(props.priority),
                  props.createdAt,
                  props.updatedAt,
                  props.isArchived,
                  props.archivedAt,
                  props.archivedBy
            );
      }

      getId(): string {
            return this.id;
      }

      changeStatus(nextStatus: string, updatedAt: Date): void {
            this.ensureNotArchived();
            this.status = this.status.transitionTo(TaskStatus.create(nextStatus));
            this.updatedAt = updatedAt;
      }

      toSnapshot(): TaskSnapshot {
            return {
                  id: this.id,
                  projectId: this.projectId,
                  creatorId: this.creatorId,
                  assigneeId: this.assigneeId,
                  title: this.title.getValue(),
                  description: this.description.getValue(),
                  status: this.status.getValue(),
                  priority: this.priority.getValue(),
                  createdAt: this.createdAt,
                  updatedAt: this.updatedAt,
                  isArchived: this.isArchived,
                  archivedAt: this.archivedAt,
                  archivedBy: this.archivedBy
            };
      }

      private ensureNotArchived(): void {
            if (this.isArchived) {
                  throw new ArchivedTaskError();
            }
      }
}
