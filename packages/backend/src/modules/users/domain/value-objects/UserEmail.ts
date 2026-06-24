import { ValidationError } from '../../../../shared/domain/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEmail {
      private constructor(private readonly value: string) {}

      static create(value: string): UserEmail {
            const email = value.trim().toLowerCase();

            if (email.length === 0) {
                  throw new ValidationError('User email cannot be empty');
            }

            if (!EMAIL_PATTERN.test(email)) {
                  throw new ValidationError('User email has invalid format');
            }

            return new UserEmail(email);
      }

      getValue(): string {
            return this.value;
      }
}
