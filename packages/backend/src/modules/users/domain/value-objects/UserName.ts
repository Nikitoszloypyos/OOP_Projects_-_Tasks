import { ValidationError } from '../../../../shared/domain/errors';

const MAX_USER_NAME_LENGTH = 80;

export class UserName {
      private constructor(private readonly value: string) {}

      static create(value: string): UserName {
            const name = value.trim();

            if (name.length === 0) {
                  throw new ValidationError('User name cannot be empty');
            }

            if (name.length > MAX_USER_NAME_LENGTH) {
                  throw new ValidationError(
                        `User name cannot be longer than ${MAX_USER_NAME_LENGTH} characters`
                  );
            }

            return new UserName(name);
      }

      getValue(): string {
            return this.value;
      }
}
