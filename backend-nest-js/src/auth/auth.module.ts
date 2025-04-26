import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Users } from '../users/entities/user.entity';
import { RateLimiterMiddleware } from '../common/middlewares/rate-limiter.middleware';

// Este módulo maneja la autenticación de usuarios, incluyendo el registro y el inicio de sesión.
// Utiliza JWT para la autenticación y TypeORM para la gestión de usuarios en la base de datos.
// El módulo también aplica un middleware de limitación de tasa para proteger la ruta de inicio de sesión.
@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_JWT_KEY'),
        signOptions: { expiresIn: configService.get<string>('TOKEN_TIME') },
      }),
      inject: [ConfigService],
      global: true, // Hacer JwtModule global
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('api/login');
  }
}
