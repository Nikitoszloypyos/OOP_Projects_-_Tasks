import type { ProjectMemberDTO } from './ProjectMemberDTO';

export interface ListProjectMembersRequestDTO {
      projectId: string;
      actorId: string;
}

export interface ListProjectMembersResponseDTO {
      members: ProjectMemberDTO[];
}
