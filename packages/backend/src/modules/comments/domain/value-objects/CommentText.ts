import { ValidationError } from '../../../../shared/domain/errors';

const MAX_COMMENT_TEXT_LENGTH = 2000;

export class CommentText {
      private constructor(private readonly value: string) {}

      static create(value: string): CommentText {
            const normalized = value.trim();

            if (!normalized) {
                  throw new ValidationError('Comment text is required');
            }

            if (normalized.length > MAX_COMMENT_TEXT_LENGTH) {
                  throw new ValidationError(
                        `Comment text must be at most ${MAX_COMMENT_TEXT_LENGTH} characters long`
                  );
            }

            return new CommentText(normalized);
      }

      getValue(): string {
            return this.value;
      }
}
