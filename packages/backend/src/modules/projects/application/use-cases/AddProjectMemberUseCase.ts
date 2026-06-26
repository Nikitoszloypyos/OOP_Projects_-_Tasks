import { ForbiddenError, NotFoundError } from '../../../../shared/domain/errors';
import type { Clock, IdGenerator } from '../../../../shared/application/ports';
import { ProjectMember } from '../../domain/entities';
import { ProjectMemberAlreadyExistsError } from '../../domain/errors';
import type { AddProjectMemberRequestDTO, AddProjectMemberResponseDTO } from '../dto';
import type {
      ProjectMemberRepository,
      ProjectRepository,
      UserLookupPort
} from '../ports';

export class AddProjectMemberUseCase {
      constructor(
            private readonly projectRepository: ProjectRepository,
            private readonly projectMemberRepository: ProjectMemberRepository,
            private readonly userLookup: UserLookupPort,
            private readonly idGenerator: IdGenerator,
            private readonly clock: Clock
      ) {}

      async execute(input: AddProjectMemberRequestDTO): Promise<AddProjectMemberResponseDTO> {
            const project = await this.projectRepository.findById(input.projectId);

            if (!project) {
                  throw new NotFoundError('Project not found');
            }

            if (project.getOwnerId() !== input.actorId) {
                  throw new ForbiddenError('Only project owner can add members');
            }

            await this.userLookup.ensureUserExists(input.userId);

            const existingMember = await this.projectMemberRepository.findByProjectAndUser(
                  input.projectId,
                  input.userId
            );

            if (existingMember) {
                  throw new ProjectMemberAlreadyExistsError();
            }

            const member = ProjectMember.create({
                  id: this.idGenerator.generate(),
                  projectId: input.projectId,
                  userId: input.userId,
                  role: 'member',
                  joinedAt: this.clock.now()
            });

            await this.projectMemberRepository.save(member);

            return { ok: true };
      }
}
