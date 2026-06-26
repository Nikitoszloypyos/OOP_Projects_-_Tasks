import { ValidationError } from '../../../../shared/domain/errors';

const MAX_USER_NAME_LENGTH = 80;

export class UserName {
      private constructor(private readonly value: string) {}

      static create(value: string): UserName {
            const normalized = value.trim();

            if (!normalized) {
                  throw new ValidationError('User name is required');
            }

            if (normalized.length > MAX_USER_NAME_LENGTH) {
                  throw new ValidationError(
                        `User name must be at most ${MAX_USER_NAME_LENGTH} characters long`
                  );
            }

            return new UserName(normalized);
      }

      getValue(): string {
            return this.value;
      }
}
