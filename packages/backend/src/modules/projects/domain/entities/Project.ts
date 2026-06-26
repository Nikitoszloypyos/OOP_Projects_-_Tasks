import { ArchivedProjectError } from '../errors/ArchivedProjectError';
import { ProjectDescription } from '../value-objects/ProjectDescription';
import { ProjectName } from '../value-objects/ProjectName';

export interface CreateProjectProps {
      id: string;
      ownerId: string;
      name: string;
      description?: string | null;
      createdAt: Date;
}

export interface RehydrateProjectProps {
      id: string;
      ownerId: string;
      name: string;
      description: string | null;
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
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
      isArchived: boolean;
      archivedAt: Date | null;
      archivedBy: string | null;
}

export class Project {
      private constructor(
            private readonly id: string,
            private readonly ownerId: string,
            private name: ProjectName,
            private description: ProjectDescription,
            private readonly createdAt: Date,
            private updatedAt: Date,
            private isArchived: boolean,
            private archivedAt: Date | null,
            private archivedBy: string | null
      ) {}

      static create(props: CreateProjectProps): Project {
            return new Project(
                  props.id,
                  props.ownerId,
                  ProjectName.create(props.name),
                  ProjectDescription.create(props.description),
                  props.createdAt,
                  props.createdAt,
                  false,
                  null,
                  null
            );
      }

      static rehydrate(props: RehydrateProjectProps): Project {
            return new Project(
                  props.id,
                  props.ownerId,
                  ProjectName.create(props.name),
                  ProjectDescription.create(props.description),
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

      getOwnerId(): string {
            return this.ownerId;
      }

      rename(name: string, updatedAt: Date): void {
            this.ensureNotArchived();
            this.name = ProjectName.create(name);
            this.updatedAt = updatedAt;
      }

      updateDescription(description: string | null | undefined, updatedAt: Date): void {
            this.ensureNotArchived();
            this.description = ProjectDescription.create(description);
            this.updatedAt = updatedAt;
      }

      archive(actorId: string, archivedAt: Date): void {
            this.ensureNotArchived();
            this.isArchived = true;
            this.archivedAt = archivedAt;
            this.archivedBy = actorId;
            this.updatedAt = archivedAt;
      }

      toSnapshot(): ProjectSnapshot {
            return {
                  id: this.id,
                  ownerId: this.ownerId,
                  name: this.name.getValue(),
                  description: this.description.getValue(),
                  createdAt: this.createdAt,
                  updatedAt: this.updatedAt,
                  isArchived: this.isArchived,
                  archivedAt: this.archivedAt,
                  archivedBy: this.archivedBy
            };
      }

      private ensureNotArchived(): void {
            if (this.isArchived) {
                  throw new ArchivedProjectError();
            }
      }
}
