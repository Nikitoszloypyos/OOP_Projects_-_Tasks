import type { PrismaClient } from '@prisma/client';

import type {
      ProjectMemberRepository,
      ProjectRepository
} from '../../application/ports';
import type { Project, ProjectMember } from '../../domain/entities';
import { ProjectMapper, ProjectMemberMapper } from '../mappers';

export class PrismaProjectRepository implements ProjectRepository {
      constructor(private readonly prisma: PrismaClient) {}

      async save(project: Project): Promise<void> {
            const data = ProjectMapper.toPersistence(project);

            await this.prisma.project.upsert({
                  where: { id: data.id },
                  create: data,
                  update: {
                        name: data.name,
                        description: data.description,
                        updatedAt: data.updatedAt,
                        isArchived: data.isArchived,
                        archivedAt: data.archivedAt,
                        archivedBy: data.archivedBy
                  }
            });
      }

      async findById(id: string): Promise<Project | null> {
            const record = await this.prisma.project.findUnique({ where: { id } });
            return record ? ProjectMapper.toDomain(record) : null;
      }

      async listByUserId(userId: string): Promise<Project[]> {
            const records = await this.prisma.project.findMany({
                  where: {
                        members: {
                              some: {
                                    userId
                              }
                        }
                  },
                  orderBy: {
                        createdAt: 'desc'
                  }
            });

            return records.map(ProjectMapper.toDomain);
      }
}

export class PrismaProjectMemberRepository implements ProjectMemberRepository {
      constructor(private readonly prisma: PrismaClient) {}

      async save(member: ProjectMember): Promise<void> {
            const data = ProjectMemberMapper.toPersistence(member);

            await this.prisma.projectMember.create({
                  data
            });
      }

      async findByProjectAndUser(projectId: string, userId: string): Promise<ProjectMember | null> {
            const record = await this.prisma.projectMember.findUnique({
                  where: {
                        projectId_userId: {
                              projectId,
                              userId
                        }
                  }
            });

            return record ? ProjectMemberMapper.toDomain(record) : null;
      }

      async listByProjectId(projectId: string) {
            const records = await this.prisma.projectMember.findMany({
                  where: { projectId },
                  include: {
                        user: {
                              select: {
                                    id: true,
                                    name: true
                              }
                        }
                  },
                  orderBy: {
                        joinedAt: 'asc'
                  }
            });

            return records.map((record) => ({
                  userId: record.user.id,
                  name: record.user.name,
                  role: record.role
            }));
      }
}
