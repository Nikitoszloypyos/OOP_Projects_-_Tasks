import type { PrismaClient } from '@prisma/client';

import type { UserRepository } from '../../application/ports';
import type { User } from '../../domain/entities';
import { UserMapper } from '../mappers';

export class PrismaUserRepository implements UserRepository {
      constructor(private readonly prisma: PrismaClient) {}

      async save(user: User): Promise<void> {
            const data = UserMapper.toPersistence(user);

            await this.prisma.user.upsert({
                  where: { id: data.id },
                  create: data,
                  update: {
                        email: data.email,
                        name: data.name,
                        passwordHash: data.passwordHash,
                        updatedAt: data.updatedAt
                  }
            });
      }

      async findById(id: string): Promise<User | null> {
            const record = await this.prisma.user.findUnique({
                  where: { id }
            });

            return record ? UserMapper.toDomain(record) : null;
      }

      async findByEmail(email: string): Promise<User | null> {
            const record = await this.prisma.user.findUnique({
                  where: { email: email.trim().toLowerCase() }
            });

            return record ? UserMapper.toDomain(record) : null;
      }

      async listAll(): Promise<User[]> {
            const records = await this.prisma.user.findMany({
                  orderBy: { createdAt: 'asc' }
            });

            return records.map((record) => UserMapper.toDomain(record));
      }
}
