import type { User } from '../../domain/entities';

export interface UserRepository {
      save(user: User): Promise<void>;
      findById(id: string): Promise<User | null>;
      findByEmail(email: string): Promise<User | null>;
      listAll(): Promise<User[]>;
}
