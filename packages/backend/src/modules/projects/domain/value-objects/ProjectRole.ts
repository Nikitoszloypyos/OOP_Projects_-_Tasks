import { ValidationError } from '../../../../shared/domain/errors';

export const PROJECT_ROLES = ['owner', 'member'] as const;

export type ProjectRoleValue = (typeof PROJECT_ROLES)[number];

export class ProjectRole {
      private constructor(private readonly value: ProjectRoleValue) {}

      static create(value: string): ProjectRole {
            if (!PROJECT_ROLES.includes(value as ProjectRoleValue)) {
                  throw new ValidationError(`Unknown project role "${value}"`);
            }

            return new ProjectRole(value as ProjectRoleValue);
      }

      static owner(): ProjectRole {
            return new ProjectRole('owner');
      }

      static member(): ProjectRole {
            return new ProjectRole('member');
      }

      equals(role: ProjectRole): boolean {
            return this.value === role.value;
      }

      getValue(): ProjectRoleValue {
            return this.value;
      }
}
