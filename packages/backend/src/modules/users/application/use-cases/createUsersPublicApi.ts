import { NotFoundError } from '../../../../shared/domain/errors';
import type { UsersPublicApi } from '../contracts';
import type { UserRepository } from '../ports';
import { userToDto } from './userToDto';

export function createUsersPublicApi(userRepository: UserRepository): UsersPublicApi {
      return {
            async ensureUserExists(userId: string): Promise<void> {
                  const user = await userRepository.findById(userId);

                  if (!user) {
                        throw new NotFoundError('User not found');
                  }
            },
            async getUserById(userId: string) {
                  const user = await userRepository.findById(userId);

                  if (!user) {
                        throw new NotFoundError('User not found');
                  }

                  return userToDto(user);
            }
      };
}
