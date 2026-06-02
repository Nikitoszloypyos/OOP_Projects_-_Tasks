import { createPrismaClient } from '../shared/infrastructure/prisma/prismaClient';
import { SystemClock } from '../shared/infrastructure/clock/SystemClock';
import { CryptoIdGenerator } from '../shared/infrastructure/identity/CryptoIdGenerator';
import { ScryptPasswordHasher } from '../shared/infrastructure/security/ScryptPasswordHasher';
import type { SharedDeps } from './types';

export function createSharedDeps(): SharedDeps {
      return {
            prisma: createPrismaClient(),
            clock: new SystemClock(),
            idGenerator: new CryptoIdGenerator(),
            passwordHasher: new ScryptPasswordHasher()
      };
}
