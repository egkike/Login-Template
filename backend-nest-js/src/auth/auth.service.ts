import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

// Este servicio maneja la autenticación de usuarios
// y la generación de tokens JWT para el acceso a la API.
// Se encarga de validar las credenciales del usuario
// y de generar un token JWT si las credenciales son válidas.
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, email, password } = loginDto;

    // Validar que al menos username o email esté presente
    if (!username && !email) {
      throw new BadRequestException('Either username or email is required');
    }

    // Buscar usuario por username o email
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', {
        username: username || '',
        email: email || '',
      })
      .getOne();

    if (!user) {
      throw new BadRequestException('Invalid username/email or password');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid username/email or password');
    }

    // Generar token JWT
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      level: user.level,
      active: user.active,
    };

    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}
