import type { FastifyPluginAsync } from 'fastify';

import type {
      GetUserByIdUseCase,
      ListUsersUseCase,
      LoginUserUseCase,
      RegisterUserUseCase
} from '../../application/use-cases';
import type {
      LoginUserRequestDTO,
      RegisterUserRequestDTO
} from '../../application/dto';

interface UsersRoutesOptions {
      registerUserUseCase: RegisterUserUseCase;
      loginUserUseCase: LoginUserUseCase;
      getUserByIdUseCase: GetUserByIdUseCase;
      listUsersUseCase: ListUsersUseCase;
}

export const usersRoutes: FastifyPluginAsync<UsersRoutesOptions> = async (app, options) => {
      app.get('/health', async () => ({
            module: 'users',
            status: 'ready'
      }));

      app.post('/register', async (request, reply) => {
            const body = request.body as RegisterUserRequestDTO;
            const result = await options.registerUserUseCase.execute(body);

            return reply.status(201).send(result);
      });

      app.post('/login', async (request) => {
            const body = request.body as LoginUserRequestDTO;
            return options.loginUserUseCase.execute(body);
      });

      app.get('/', async () => options.listUsersUseCase.execute());

      app.get('/:id', async (request) => {
            const params = request.params as { id: string };
            return options.getUserByIdUseCase.execute({ userId: params.id });
      });
};
