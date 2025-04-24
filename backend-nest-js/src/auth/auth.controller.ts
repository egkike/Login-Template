import {
  Controller,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

// Este código es parte de un controlador de autenticación en NestJS.
// Se encarga de manejar las solicitudes de inicio de sesión de los usuarios.
// El controlador utiliza el servicio de autenticación para procesar las credenciales
// y devolver un token de sesión si las credenciales son válidas.
@ApiTags('Authentication')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid username/email or password',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);
    if ('error' in result) {
      return { error: result.error };
    }

    const { password, ...publicData } = result.user;
    res.cookie('session_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 3600000,
    });

    return publicData;
  }
}
