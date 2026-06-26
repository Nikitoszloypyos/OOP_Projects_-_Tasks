import { ForbiddenError, NotFoundError } from '../../../../shared/domain/errors';
import type {
      ListProjectMembersRequestDTO,
      ListProjectMembersResponseDTO
} from '../dto';
import type { ProjectMemberRepository, ProjectRepository } from '../ports';

export class ListProjectMembersUseCase {
      constructor(
            private readonly projectRepository: ProjectRepository,
            private readonly projectMemberRepository: ProjectMemberRepository
      ) {}

      async execute(
            input: ListProjectMembersRequestDTO
      ): Promise<ListProjectMembersResponseDTO> {
            const project = await this.projectRepository.findById(input.projectId);

            if (!project) {
                  throw new NotFoundError('Project not found');
            }

            const membership = await this.projectMemberRepository.findByProjectAndUser(
                  input.projectId,
                  input.actorId
            );

            if (!membership) {
                  throw new ForbiddenError('User is not a project member');
            }

            const members = await this.projectMemberRepository.listByProjectId(input.projectId);

            return {
                  members
            };
      }
}
