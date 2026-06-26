import type { UserDTO } from '../dto';

export interface UsersPublicApi {
      ensureUserExists(userId: string): Promise<void>;
      getUserById(userId: string): Promise<UserDTO>;
}
