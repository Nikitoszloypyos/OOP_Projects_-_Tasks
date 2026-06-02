import type { PrismaClient } from '@prisma/client';

import type { Clock } from '../shared/application/ports/Clock';
import type { IdGenerator } from '../shared/application/ports/IdGenerator';
import type { PasswordHasher } from '../shared/application/ports/PasswordHasher';

export const APP_MODULES = ['users', 'projects', 'tasks', 'comments'] as const;

export type AppModuleName = (typeof APP_MODULES)[number];

export interface CreateAppOptions {
      enabledModules?: AppModuleName[];
}

export interface SharedDeps {
      prisma: PrismaClient;
      clock: Clock;
      idGenerator: IdGenerator;
      passwordHasher: PasswordHasher;
}
