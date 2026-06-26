import { ValidationError } from '../../../../shared/domain/errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserEmail {
      private constructor(private readonly value: string) {}

      static create(value: string): UserEmail {
            const normalized = value.trim().toLowerCase();

            if (!normalized) {
                  throw new ValidationError('Email is required');
            }

            if (!EMAIL_REGEX.test(normalized)) {
                  throw new ValidationError('Email format is invalid');
            }

            return new UserEmail(normalized);
      }

      getValue(): string {
            return this.value;
      }
}
