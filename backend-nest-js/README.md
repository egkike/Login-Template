## Crear el proyecto (utilicé npm):

```bash
$ nest new Backend-NestJS
```

## Configurar el entorno:
### dotenv para manejar variables de entorno:

```bash
npm install @nestjs/config
```

### Crea un archivo .env en la raíz del proyecto y agregar tus datos:

```
PORT=3000
SECRET_JWT_KEY=your_jwt_secret_key_here
TOKEN_TIME=1h
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_PORT=5432
DB_NAME=your_db_name
```

### Actualiza src/app.module.ts para cargar las variables de entorno:

```
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno sean accesibles globalmente
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Modifica src/main.ts para usar el puerto desde las variables de entorno:

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

### Prueba ejecutando:
```bash
npm run start:dev
```

## Instalar dependecias:
```bash
npm install @nestjs/common @nestjs/typeorm typeorm pg @nestjs/jwt bcrypt @nestjs/cookie-parser express-rate-limit class-validator class-transformer

npm install winston winston-daily-rotate-file
npm install helmet
```
