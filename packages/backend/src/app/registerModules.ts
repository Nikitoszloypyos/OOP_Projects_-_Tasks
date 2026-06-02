import type { FastifyInstance } from 'fastify';

import { registerUsersModule } from '../modules/users';
import { registerProjectsModule } from '../modules/projects';
import { registerTasksModule } from '../modules/tasks';
import { registerCommentsModule } from '../modules/comments';
import { APP_MODULES, AppModuleName, SharedDeps } from './types';

export function parseEnabledModules(value?: string): AppModuleName[] {
      if (!value || value === 'all') {
            return [...APP_MODULES];
      }

      const modules = value
            .split(',')
            .map((moduleName) => moduleName.trim())
            .filter(Boolean);

      const unknownModules = modules.filter(
            (moduleName) => !APP_MODULES.includes(moduleName as AppModuleName)
      );

      if (unknownModules.length > 0) {
            throw new Error(`Unknown backend modules: ${unknownModules.join(', ')}`);
      }

      return modules as AppModuleName[];
}

export async function registerModules(
      app: FastifyInstance,
      deps: SharedDeps,
      enabledModules: AppModuleName[] = [...APP_MODULES]
): Promise<void> {
      const enabled = new Set(enabledModules);

      if (enabled.has('users')) {
            await registerUsersModule(app, deps);
      }

      if (enabled.has('projects')) {
            await registerProjectsModule(app, deps);
      }

      if (enabled.has('tasks')) {
            await registerTasksModule(app, deps);
      }

      if (enabled.has('comments')) {
            await registerCommentsModule(app, deps);
      }
}
