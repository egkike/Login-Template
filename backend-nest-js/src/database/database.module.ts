import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

// Aquí puedes importar otras entidades que necesites
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User], // Agrega aquí todas las entidades
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Desactiva en producción
        ssl: { rejectUnauthorized: false }, // Desactiva la verificación de certificados SSL
        typeCast: (field, next) => {
          if (field.type === 'NUMERIC') {
            return parseFloat(field.string());
          }
          return next();
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
