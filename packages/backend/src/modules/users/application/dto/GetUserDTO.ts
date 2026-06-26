import type { UserDTO } from './UserDTO';

export interface GetUserRequestDTO {
      userId: string;
}

export interface GetUserResponseDTO {
      user: UserDTO;
}
