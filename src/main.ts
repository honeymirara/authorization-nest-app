import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { YourLogger } from './../logger.service';
import {setupSwagger} from 'setupSwagger'


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new YourLogger() });
  app.setGlobalPrefix('api');
  app.enableCors()
  
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();

