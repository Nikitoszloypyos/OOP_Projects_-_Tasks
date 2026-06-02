export abstract class AppError extends Error {
      protected constructor(
            public readonly code: string,
            message: string,
            public readonly statusCode: number
      ) {
            super(message);
            this.name = new.target.name;
      }
}
