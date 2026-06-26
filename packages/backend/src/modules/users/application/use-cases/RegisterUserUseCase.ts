import { ValidationError } from '../../../../shared/domain/errors';
import type { Clock, IdGenerator, PasswordHasher } from '../../../../shared/application/ports';
import { User } from '../../domain/entities';
import { UserEmailAlreadyTakenError } from '../../domain/errors';
import type { RegisterUserRequestDTO, RegisterUserResponseDTO } from '../dto';
import type { UserRepository } from '../ports';
import { userToDto } from './userToDto';

const loginToEmail = (login: string) => `${login.trim().toLowerCase()}@task.local`;

export class RegisterUserUseCase {
      constructor(
            private readonly userRepository: UserRepository,
            private readonly idGenerator: IdGenerator,
            private readonly clock: Clock,
            private readonly passwordHasher: PasswordHasher
      ) {}

      async execute(input: RegisterUserRequestDTO): Promise<RegisterUserResponseDTO> {
            if (!input.login.trim()) {
                  throw new ValidationError('Login is required');
            }

            if (!input.password.trim()) {
                  throw new ValidationError('Password is required');
            }

            const email = loginToEmail(input.login);
            const existingUser = await this.userRepository.findByEmail(email);

            if (existingUser) {
                  throw new UserEmailAlreadyTakenError();
            }

            const now = this.clock.now();
            const passwordHash = await this.passwordHasher.hash(input.password);
            const user = User.create({
                  id: this.idGenerator.generate(),
                  email,
                  name: input.login.trim(),
                  passwordHash,
                  createdAt: now
            });

            await this.userRepository.save(user);

            return {
                  user: userToDto(user)
            };
      }
}
