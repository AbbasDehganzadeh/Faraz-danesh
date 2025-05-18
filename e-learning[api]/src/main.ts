import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swConfig = new DocumentBuilder()
    .setTitle('Faraz-danesh e-learning app')
    .setDescription('A semi-functional app for learning/teaching')
    .setBasePath('api')
    .setVersion('0.1')
    .addTag('e-learning')
    .addBearerAuth()
    .build();
  const docFactory = () => SwaggerModule.createDocument(app, swConfig);
  SwaggerModule.setup('docs', app, docFactory);

  await app.listen(3024);
}
bootstrap();
