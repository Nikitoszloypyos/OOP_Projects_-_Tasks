import type { UserDTO } from './UserDTO';

export interface LoginUserRequestDTO {
      login: string;
      password: string;
}

export interface LoginUserResponseDTO {
      user: UserDTO;
}
