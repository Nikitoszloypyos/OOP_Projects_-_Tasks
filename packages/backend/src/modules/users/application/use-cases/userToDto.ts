import type { User } from '../../domain/entities';
import type { UserDTO } from '../dto';

export function userToDto(user: User): UserDTO {
      return {
            id: user.getId(),
            email: user.getEmail(),
            name: user.getName(),
            createdAt: user.getCreatedAt().toISOString(),
            updatedAt: user.getUpdatedAt().toISOString()
      };
}
