import { InvalidCredentialsError } from '../../domain/errors';
import type { LoginUserRequestDTO, LoginUserResponseDTO } from '../dto';
import type { UserRepository } from '../ports';
import type { PasswordHasher } from '../../../../shared/application/ports';
import { userToDto } from './userToDto';

const loginToEmail = (login: string) => `${login.trim().toLowerCase()}@task.local`;

export class LoginUserUseCase {
      constructor(
            private readonly userRepository: UserRepository,
            private readonly passwordHasher: PasswordHasher
      ) {}

      async execute(input: LoginUserRequestDTO): Promise<LoginUserResponseDTO> {
            const user = await this.userRepository.findByEmail(loginToEmail(input.login));

            if (!user) {
                  throw new InvalidCredentialsError();
            }

            const isPasswordValid = await this.passwordHasher.verify(
                  input.password,
                  user.getPasswordHash()
            );

            if (!isPasswordValid) {
                  throw new InvalidCredentialsError();
            }

            return {
                  user: userToDto(user)
            };
      }
}
