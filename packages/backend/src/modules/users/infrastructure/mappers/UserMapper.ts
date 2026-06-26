import type { User as PrismaUser } from '@prisma/client';

import { User } from '../../domain/entities';

export class UserMapper {
      static toDomain(record: PrismaUser): User {
            return User.rehydrate({
                  id: record.id,
                  email: record.email,
                  name: record.name,
                  passwordHash: record.passwordHash,
                  createdAt: record.createdAt,
                  updatedAt: record.updatedAt
            });
      }

      static toPersistence(user: User) {
            const snapshot = user.toSnapshot();

            return {
                  id: snapshot.id,
                  email: snapshot.email,
                  name: snapshot.name,
                  passwordHash: snapshot.passwordHash,
                  createdAt: snapshot.createdAt,
                  updatedAt: snapshot.updatedAt
            };
      }
}
