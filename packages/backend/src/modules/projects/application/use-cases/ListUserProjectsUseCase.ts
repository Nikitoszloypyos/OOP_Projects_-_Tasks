import type { ListUserProjectsRequestDTO, ListUserProjectsResponseDTO } from '../dto';
import type { ProjectRepository } from '../ports';
import { projectToDto } from './projectToDto';

export class ListUserProjectsUseCase {
      constructor(private readonly projectRepository: ProjectRepository) {}

      async execute(input: ListUserProjectsRequestDTO): Promise<ListUserProjectsResponseDTO> {
            const projects = await this.projectRepository.listByUserId(input.userId);

            return {
                  projects: projects.map(projectToDto)
            };
      }
}
