import type { Project as PrismaProject, ProjectMember as PrismaProjectMember } from '@prisma/client';

import { Project, ProjectMember } from '../../domain/entities';

export class ProjectMapper {
      static toDomain(record: PrismaProject): Project {
            return Project.rehydrate({
                  id: record.id,
                  ownerId: record.ownerId,
                  name: record.name,
                  description: record.description,
                  createdAt: record.createdAt,
                  updatedAt: record.updatedAt,
                  isArchived: record.isArchived,
                  archivedAt: record.archivedAt,
                  archivedBy: record.archivedBy
            });
      }

      static toPersistence(project: Project) {
            return project.toSnapshot();
      }
}

export class ProjectMemberMapper {
      static toDomain(record: PrismaProjectMember): ProjectMember {
            return ProjectMember.rehydrate({
                  id: record.id,
                  projectId: record.projectId,
                  userId: record.userId,
                  role: record.role,
                  joinedAt: record.joinedAt
            });
      }

      static toPersistence(member: ProjectMember) {
            return member.toSnapshot();
      }
}
