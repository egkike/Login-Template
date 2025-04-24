import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configurar Helmet para encabezados de seguridad
  app.use(helmet());

  // Configurar CORS
  const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://www.mipagina.com',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS error: ${origin} not allowed`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  // Configurar cookie-parser
  app.use(cookieParser());

  // Configurar pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 400,
    }),
  );

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
