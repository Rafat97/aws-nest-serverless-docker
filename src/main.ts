import { NestFactory } from '@nestjs/core';
import figlet from 'figlet';
import { AppModule } from './app.module';
import helmet from 'helmet';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { Logger } from '@nestjs/common';

export async function commonMain() {
  console.log(figlet.textSync('NestJS'));
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.json(),
            // winston.format.prettyPrint(),
            // nestWinstonModuleUtilities.format.nestLike('APP', {
            //   prettyPrint: true,
            //   colors: true,
            // }),
          ),
        }),
      ],
    }),
  });
  app.use(helmet());
  app.enableCors();
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  return app;
}

async function bootstrap() {
  const app = await commonMain();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0', async () => {
    return Logger.log(`Application started on port ${await app.getUrl()}`);
  });
}
bootstrap();
