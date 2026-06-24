import { ValidationError } from '../../../../shared/domain/errors';
import { ProjectRole, ProjectRoleValue } from '../value-objects';

export interface CreateProjectMemberParams {
      id: string;
      projectId: string;
      userId: string;
      role?: ProjectRoleValue;
      joinedAt: Date;
}

export interface RehydrateProjectMemberParams {
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
      role: ProjectRoleValue;
      joinedAt: Date;
}

interface ProjectMemberProps {
      id: string;
      projectId: string;
      userId: string;
      role: ProjectRole;
      joinedAt: Date;
}

export class ProjectMember {
      private constructor(private readonly props: ProjectMemberProps) {
            this.assertRequiredId(props.id, 'Project member id');
            this.assertRequiredId(props.projectId, 'Project id');
            this.assertRequiredId(props.userId, 'User id');
      }

      static create(params: CreateProjectMemberParams): ProjectMember {
            return new ProjectMember({
                  id: params.id,
                  projectId: params.projectId,
                  userId: params.userId,
                  role: params.role ? ProjectRole.create(params.role) : ProjectRole.member(),
                  joinedAt: cloneDate(params.joinedAt)
            });
      }

      static rehydrate(params: RehydrateProjectMemberParams): ProjectMember {
            return new ProjectMember({
                  id: params.id,
                  projectId: params.projectId,
                  userId: params.userId,
                  role: ProjectRole.create(params.role),
                  joinedAt: cloneDate(params.joinedAt)
            });
      }

      changeRole(role: ProjectRoleValue): void {
            this.props.role = ProjectRole.create(role);
      }

      isOwner(): boolean {
            return this.props.role.equals(ProjectRole.owner());
      }

      toSnapshot(): ProjectMemberSnapshot {
            return {
                  id: this.props.id,
                  projectId: this.props.projectId,
                  userId: this.props.userId,
                  role: this.props.role.getValue(),
                  joinedAt: cloneDate(this.props.joinedAt)
            };
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
