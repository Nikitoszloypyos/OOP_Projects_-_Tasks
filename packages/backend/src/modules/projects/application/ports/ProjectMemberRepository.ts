import type { ProjectMember } from '../../domain/entities';

export interface ProjectMemberListItem {
      userId: string;
      name: string;
      role: string;
}

export interface ProjectMemberRepository {
      save(member: ProjectMember): Promise<void>;
      findByProjectAndUser(projectId: string, userId: string): Promise<ProjectMember | null>;
      listByProjectId(projectId: string): Promise<ProjectMemberListItem[]>;
}
