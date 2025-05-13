import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UsersModule } from './users/users.module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('API para gestionar películas y usuarios')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [UsersModule],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
