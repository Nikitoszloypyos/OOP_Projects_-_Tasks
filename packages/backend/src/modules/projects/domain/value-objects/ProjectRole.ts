import { ValidationError } from '../../../../shared/domain/errors';

export type ProjectRoleValue = 'owner' | 'member';

export class ProjectRole {
      private constructor(private readonly value: ProjectRoleValue) {}

      static create(value: string): ProjectRole {
            if (value !== 'owner' && value !== 'member') {
                  throw new ValidationError('Project role is invalid');
            }

            return new ProjectRole(value);
      }

      static owner(): ProjectRole {
            return new ProjectRole('owner');
      }

      static member(): ProjectRole {
            return new ProjectRole('member');
      }

      getValue(): ProjectRoleValue {
            return this.value;
      }

      equals(other: ProjectRole): boolean {
            return this.value === other.value;
      }
}
