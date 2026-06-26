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
      let usersApi;
      let projectsApi;
      let tasksApi;

      if (enabled.has('users')) {
            usersApi = await registerUsersModule(app, deps);
      }

      if (enabled.has('projects')) {
            if (!usersApi) {
                  throw new Error('Projects module requires users module to be enabled');
            }

            projectsApi = await registerProjectsModule(app, deps, usersApi);
      }

      if (enabled.has('tasks')) {
            if (!usersApi || !projectsApi) {
                  throw new Error('Tasks module requires users and projects modules to be enabled');
            }

            tasksApi = await registerTasksModule(app, deps, usersApi, projectsApi);
      }

      if (enabled.has('comments')) {
            if (!tasksApi) {
                  throw new Error('Comments module requires tasks module to be enabled');
            }

            await registerCommentsModule(app, deps, tasksApi);
      }
}
