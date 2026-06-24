import { ValidationError } from '../../../../shared/domain/errors';

const MAX_COMMENT_TEXT_LENGTH = 2_000;

export class CommentText {
      private constructor(private readonly value: string) {}

      static create(value: string): CommentText {
            const text = value.trim();

            if (text.length === 0) {
                  throw new ValidationError('Comment text cannot be empty');
            }

            if (text.length > MAX_COMMENT_TEXT_LENGTH) {
                  throw new ValidationError(
                        `Comment text cannot be longer than ${MAX_COMMENT_TEXT_LENGTH} characters`
                  );
            }

            return new CommentText(text);
      }

      getValue(): string {
            return this.value;
      }
}
