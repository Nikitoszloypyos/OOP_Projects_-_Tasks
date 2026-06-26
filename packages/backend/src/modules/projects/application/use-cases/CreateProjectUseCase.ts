import type { Clock, IdGenerator } from '../../../../shared/application/ports';
import { Project, ProjectMember } from '../../domain/entities';
import type { CreateProjectRequestDTO, CreateProjectResponseDTO } from '../dto';
import type {
      ProjectMemberRepository,
      ProjectRepository,
      UserLookupPort
} from '../ports';
import { projectToDto } from './projectToDto';

export class CreateProjectUseCase {
      constructor(
            private readonly projectRepository: ProjectRepository,
            private readonly projectMemberRepository: ProjectMemberRepository,
            private readonly userLookup: UserLookupPort,
            private readonly idGenerator: IdGenerator,
            private readonly clock: Clock
      ) {}

      async execute(input: CreateProjectRequestDTO): Promise<CreateProjectResponseDTO> {
            await this.userLookup.ensureUserExists(input.actorId);
            const ownerId = input.ownerId ?? input.actorId;
            await this.userLookup.ensureUserExists(ownerId);

            const now = this.clock.now();
            const project = Project.create({
                  id: this.idGenerator.generate(),
                  ownerId,
                  name: input.name,
                  description: input.description,
                  createdAt: now
            });

            const ownerMembership = ProjectMember.create({
                  id: this.idGenerator.generate(),
                  projectId: project.getId(),
                  userId: ownerId,
                  role: 'owner',
                  joinedAt: now
            });

            await this.projectRepository.save(project);
            await this.projectMemberRepository.save(ownerMembership);

            if (input.actorId !== ownerId) {
                  const actorMembership = ProjectMember.create({
                        id: this.idGenerator.generate(),
                        projectId: project.getId(),
                        userId: input.actorId,
                        role: 'member',
                        joinedAt: now
                  });

                  await this.projectMemberRepository.save(actorMembership);
            }

            return {
                  project: projectToDto(project)
            };
      }
}
