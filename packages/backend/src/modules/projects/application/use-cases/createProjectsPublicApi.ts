import { ForbiddenError, NotFoundError } from '../../../../shared/domain/errors';
import type { ProjectsPublicApi } from '../contracts';
import type { ProjectMemberRepository, ProjectRepository } from '../ports';

export function createProjectsPublicApi(
      projectRepository: ProjectRepository,
      projectMemberRepository: ProjectMemberRepository
): ProjectsPublicApi {
      return {
            async ensureProjectExists(projectId: string): Promise<void> {
                  const project = await projectRepository.findById(projectId);

                  if (!project) {
                        throw new NotFoundError('Project not found');
                  }
            },
            async ensureUserIsProjectMember(projectId: string, userId: string): Promise<void> {
                  const membership = await projectMemberRepository.findByProjectAndUser(
                        projectId,
                        userId
                  );

                  if (!membership) {
                        throw new ForbiddenError('User is not a project member');
                  }
            }
      };
}
