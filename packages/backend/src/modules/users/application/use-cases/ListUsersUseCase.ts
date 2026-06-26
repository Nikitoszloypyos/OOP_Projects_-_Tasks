import type { UserRepository } from '../ports';
import { userToDto } from './userToDto';

export class ListUsersUseCase {
      constructor(private readonly userRepository: UserRepository) {}

      async execute() {
            const users = await this.userRepository.listAll();

            return {
                  users: users.map(userToDto)
            };
      }
}
