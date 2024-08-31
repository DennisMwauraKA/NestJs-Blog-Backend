import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder,SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  /**Swagger configuration */
  const config = new DocumentBuilder().
  setTitle('NestJs-Blog-API')
  .setVersion('1.0')
  .setDescription("Use the base as http://localhost:3000/ ")
  .setTermsOfService('http://localhost:3000/service')
  .setLicense('MIT LICENSE','https://github.com/DennisMwauraKA')
  .addServer('http://localhost:3000/')
  .build();

  // instantiate document
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);
  await app.listen(3000);
}
bootstrap();
