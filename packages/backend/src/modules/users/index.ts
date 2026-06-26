import type { FastifyInstance } from 'fastify';

import type { SharedDeps } from '../../app/types';
import {
      GetUserByIdUseCase,
      ListUsersUseCase,
      LoginUserUseCase,
      RegisterUserUseCase
} from './application/use-cases';
import { createUsersPublicApi } from './application/use-cases';
import type { UsersPublicApi } from './application/contracts';
import { usersRoutes } from './infrastructure/http/usersRoutes';
import { PrismaUserRepository } from './infrastructure/persistence';

export async function registerUsersModule(
      app: FastifyInstance,
      deps: SharedDeps
): Promise<UsersPublicApi> {
      const userRepository = new PrismaUserRepository(deps.prisma);

      const registerUserUseCase = new RegisterUserUseCase(
            userRepository,
            deps.idGenerator,
            deps.clock,
            deps.passwordHasher
      );
      const loginUserUseCase = new LoginUserUseCase(userRepository, deps.passwordHasher);
      const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
      const listUsersUseCase = new ListUsersUseCase(userRepository);

      await app.register(usersRoutes, {
            prefix: '/users',
            registerUserUseCase,
            loginUserUseCase,
            getUserByIdUseCase,
            listUsersUseCase
      });

      return createUsersPublicApi(userRepository);
}
