import type { UserDTO } from './UserDTO';

export interface RegisterUserRequestDTO {
      login: string;
      password: string;
}

export interface RegisterUserResponseDTO {
      user: UserDTO;
}
