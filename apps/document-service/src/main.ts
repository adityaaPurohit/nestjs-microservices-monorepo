import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getKafkaConfig } from '@kafka/config/kafka.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(getKafkaConfig());

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Document Service API')
    .setDescription('API documentation for the Document microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.startAllMicroservices();

  const port = process.env.PORT_Document || 3003;
  await app.listen(port);

  console.log(`Document service is running on port ${port}`);
}
bootstrap();
