import { ValidationError } from '../../../../shared/domain/errors';
import { UserEmail, UserName } from '../value-objects';

export interface CreateUserParams {
      id: string;
      email: string;
      name: string;
      passwordHash: string;
      createdAt: Date;
}

export interface RehydrateUserParams {
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

interface UserProps {
      id: string;
      email: UserEmail;
      name: UserName;
      passwordHash: string;
      createdAt: Date;
      updatedAt: Date;
}

export class User {
      private constructor(private readonly props: UserProps) {
            this.assertRequiredId(props.id, 'User id');
            this.assertPasswordHash(props.passwordHash);
      }

      static create(params: CreateUserParams): User {
            return new User({
                  id: params.id,
                  email: UserEmail.create(params.email),
                  name: UserName.create(params.name),
                  passwordHash: params.passwordHash,
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.createdAt)
            });
      }

      static rehydrate(params: RehydrateUserParams): User {
            return new User({
                  id: params.id,
                  email: UserEmail.create(params.email),
                  name: UserName.create(params.name),
                  passwordHash: params.passwordHash,
                  createdAt: cloneDate(params.createdAt),
                  updatedAt: cloneDate(params.updatedAt)
            });
      }

      rename(name: string, updatedAt: Date): void {
            this.props.name = UserName.create(name);
            this.touch(updatedAt);
      }

      changeEmail(email: string, updatedAt: Date): void {
            this.props.email = UserEmail.create(email);
            this.touch(updatedAt);
      }

      changePasswordHash(passwordHash: string, updatedAt: Date): void {
            this.assertPasswordHash(passwordHash);
            this.props.passwordHash = passwordHash;
            this.touch(updatedAt);
      }

      toSnapshot(): UserSnapshot {
            return {
                  id: this.props.id,
                  email: this.props.email.getValue(),
                  name: this.props.name.getValue(),
                  passwordHash: this.props.passwordHash,
                  createdAt: cloneDate(this.props.createdAt),
                  updatedAt: cloneDate(this.props.updatedAt)
            };
      }

      private touch(updatedAt: Date): void {
            this.props.updatedAt = cloneDate(updatedAt);
      }

      private assertRequiredId(value: string, label: string): void {
            if (value.trim().length === 0) {
                  throw new ValidationError(`${label} cannot be empty`);
            }
      }

      private assertPasswordHash(value: string): void {
            if (value.trim().length === 0) {
                  throw new ValidationError('User password hash cannot be empty');
            }
      }
}

function cloneDate(date: Date): Date {
      return new Date(date);
}
