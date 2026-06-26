import { NotFoundError } from '../../../../shared/domain/errors';
import type { GetUserRequestDTO, GetUserResponseDTO } from '../dto';
import type { UserRepository } from '../ports';
import { userToDto } from './userToDto';

export class GetUserByIdUseCase {
      constructor(private readonly userRepository: UserRepository) {}

      async execute(input: GetUserRequestDTO): Promise<GetUserResponseDTO> {
            const user = await this.userRepository.findById(input.userId);

            if (!user) {
                  throw new NotFoundError('User not found');
            }

            return {
                  user: userToDto(user)
            };
      }
}
