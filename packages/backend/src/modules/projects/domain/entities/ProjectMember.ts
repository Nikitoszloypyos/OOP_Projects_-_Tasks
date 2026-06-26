import { ProjectRole } from '../value-objects/ProjectRole';

export interface CreateProjectMemberProps {
      id: string;
      projectId: string;
      userId: string;
      role?: 'owner' | 'member';
      joinedAt: Date;
}

export interface RehydrateProjectMemberProps {
      id: string;
      projectId: string;
      userId: string;
      role: string;
      joinedAt: Date;
}

export interface ProjectMemberSnapshot {
      id: string;
      projectId: string;
      userId: string;
      role: 'owner' | 'member';
      joinedAt: Date;
}

export class ProjectMember {
      private constructor(
            private readonly id: string,
            private readonly projectId: string,
            private readonly userId: string,
            private role: ProjectRole,
            private readonly joinedAt: Date
      ) {}

      static create(props: CreateProjectMemberProps): ProjectMember {
            return new ProjectMember(
                  props.id,
                  props.projectId,
                  props.userId,
                  props.role ? ProjectRole.create(props.role) : ProjectRole.member(),
                  props.joinedAt
            );
      }

      static rehydrate(props: RehydrateProjectMemberProps): ProjectMember {
            return new ProjectMember(
                  props.id,
                  props.projectId,
                  props.userId,
                  ProjectRole.create(props.role),
                  props.joinedAt
            );
      }

      getProjectId(): string {
            return this.projectId;
      }

      getUserId(): string {
            return this.userId;
      }

      isOwner(): boolean {
            return this.role.equals(ProjectRole.owner());
      }

      toSnapshot(): ProjectMemberSnapshot {
            return {
                  id: this.id,
                  projectId: this.projectId,
                  userId: this.userId,
                  role: this.role.getValue(),
                  joinedAt: this.joinedAt
            };
      }
}
