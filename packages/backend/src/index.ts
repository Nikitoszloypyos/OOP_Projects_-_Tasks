import { createApp } from './app/createApp';
import { parseEnabledModules } from './app/registerModules';

async function bootstrap() {
      const enabledModules = parseEnabledModules(process.env.ENABLED_MODULES);
      const app = await createApp({ enabledModules });

      const port = Number(process.env.PORT) || 8080;
      const host = process.env.HOST || '0.0.0.0';

      try {
            await app.listen({ port, host });
            app.log.info(`Server listening on http://${host}:${port}`);
      } catch (error) {
            app.log.error(error);
            process.exit(1);
      }
}

bootstrap().catch((error) => {
      console.error('Failed to bootstrap application:', error);
      process.exit(1);
});
