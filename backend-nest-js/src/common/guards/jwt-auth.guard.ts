import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Importa el decorador Injectable para poder inyectar dependencias
// Importa el decorador CanActivate para crear un guard
// Importa el decorador ExecutionContext para obtener el contexto de la solicitud
// Importa el servicio JwtService para manejar JWT
// Importa el servicio ConfigService para manejar la configuración de la aplicación
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.cookies['session_token'];

    if (!token) {
      request.session = { error: 'No token provided' };
      return true; // Continúa para que el controlador maneje el error
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET_JWT_KEY'),
      });

      request.session = { tokenData: payload };

      // Generar nuevo token
      const newToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('SECRET_JWT_KEY'),
        expiresIn: this.configService.get<string>('TOKEN_TIME'),
      });

      response.cookie('session_token', newToken, {
        httpOnly: true,
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600000, // 1 hora
      });

      return true;
    } catch (error) {
      request.session = { error: 'Invalid token' };
      return true; // Continúa para que el controlador maneje el error
    }
  }
}
