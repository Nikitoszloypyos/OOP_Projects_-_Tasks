import { ValidationError } from '../../../../shared/domain/errors';
import { ArchivedProjectError } from '../errors';
import { ProjectDescription, ProjectName } from '../value-objects';

export interface CreateProjectParams {
      id: string;
      ownerId: string;
      name: string;
      description?: string | null;
      createdAt: Date;
}

export interface RehydrateProjectParams {
      id: string;
      ownerId: string;
      name: string;
      description?: string | null;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

export interface ProjectSnapshot {
      id: string;
      ownerId: string;
      name: string;
      description: string;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

interface ProjectProps {
      id: string;
      ownerId: string;
      name: ProjectName;
      description: ProjectDescription;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

export class Project {
      private constructor(private readonly props: ProjectProps) {
            this.assertRequiredId(props.id, 'Project id');
            this.assertRequiredId(props.ownerId, 'Project owner id');

            if (props.archivedBy !== null) {
                  this.assertRequiredId(props.archivedBy, 'Archive actor id');
            }
      }

      static create(params: CreateProjectParams): Project {
            return new Project({
                  id: params.id,
                  ownerId: params.ownerId,
                  name: ProjectName.create(params.name),
                  description: ProjectDescription.create(params.description),
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.createdAt),
                  isArchived: false,
                  archivedAt: null,
                  archivedBy: null
            });
      }

      static rehydrate(params: RehydrateProjectParams): Project {
            return new Project({
                  id: params.id,
                  ownerId: params.ownerId,
                  name: ProjectName.create(params.name),
                  description: ProjectDescription.create(params.description),
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.updatedAt),
                  isArchived: params.isArchived,
                  archivedAt: params.archivedAt ? cloneDate(params.archivedAt) : null,
                  archivedBy: params.archivedBy
            });
      }

      rename(name: string, updatedAt: Date): void {
            this.assertActive();
            this.props.name = ProjectName.create(name);
            this.touch(updatedAt);
      }

      updateDescription(description: string | null | undefined, updatedAt: Date): void {
            this.assertActive();
            this.props.description = ProjectDescription.create(description);
            this.touch(updatedAt);
      }

      archive(actorId: string, archivedAt: Date): void {
            this.assertRequiredId(actorId, 'Archive actor id');

            if (this.props.isArchived) {
                  throw new ArchivedProjectError('Project is already archived');
            }

            this.props.isArchived = true;
            this.props.archivedAt = cloneDate(archivedAt);
            this.props.archivedBy = actorId;
            this.touch(archivedAt);
      }

      toSnapshot(): ProjectSnapshot {
            return {
                  id: this.props.id,
                  ownerId: this.props.ownerId,
                  name: this.props.name.getValue(),
                  description: this.props.description.getValue(),
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
                  throw new ArchivedProjectError();
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
