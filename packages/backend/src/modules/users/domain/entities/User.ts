import { UserEmail } from '../value-objects/UserEmail';
import { UserName } from '../value-objects/UserName';

export interface CreateUserProps {
      id: string;
      email: string;
      name: string;
      passwordHash: string;
      createdAt: Date;
}

export interface RehydrateUserProps {
      id: string;
      email: string;
      name: string;
      passwordHash: string;
      createdAt: Date;
      updatedAt: Date;
}

export interface UserSnapshot {
      id: string;
      email: string;
      name: string;
      passwordHash: string;
      createdAt: Date;
      updatedAt: Date;
}

export class User {
      private constructor(
            private readonly id: string,
            private email: UserEmail,
            private name: UserName,
            private passwordHash: string,
            private readonly createdAt: Date,
            private updatedAt: Date
      ) {}

      static create(props: CreateUserProps): User {
            return new User(
                  props.id,
                  UserEmail.create(props.email),
                  UserName.create(props.name),
                  props.passwordHash,
                  props.createdAt,
                  props.createdAt
            );
      }

      static rehydrate(props: RehydrateUserProps): User {
            return new User(
                  props.id,
                  UserEmail.create(props.email),
                  UserName.create(props.name),
                  props.passwordHash,
                  props.createdAt,
                  props.updatedAt
            );
      }

      getId(): string {
            return this.id;
      }

      getEmail(): string {
            return this.email.getValue();
      }

      getName(): string {
            return this.name.getValue();
      }

      getPasswordHash(): string {
            return this.passwordHash;
      }

      getCreatedAt(): Date {
            return this.createdAt;
      }

      getUpdatedAt(): Date {
            return this.updatedAt;
      }

      rename(name: string, updatedAt: Date): void {
            this.name = UserName.create(name);
            this.updatedAt = updatedAt;
      }

      changeEmail(email: string, updatedAt: Date): void {
            this.email = UserEmail.create(email);
            this.updatedAt = updatedAt;
      }

      changePasswordHash(passwordHash: string, updatedAt: Date): void {
            this.passwordHash = passwordHash;
            this.updatedAt = updatedAt;
      }

      toSnapshot(): UserSnapshot {
            return {
                  id: this.id,
                  email: this.email.getValue(),
                  name: this.name.getValue(),
                  passwordHash: this.passwordHash,
                  createdAt: this.createdAt,
                  updatedAt: this.updatedAt
            };
      }
}
