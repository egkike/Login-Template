import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

// Este servicio maneja la autenticación de los usuarios
// y la generación de tokens JWT para el acceso a la API.
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { username, email, password } = loginDto;

    if (!username && !email) {
      return { error: 'Username or email is required' };
    }

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      return { error: 'Invalid username/email or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Invalid username/email or password' };
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_JWT_KEY'),
      expiresIn: this.configService.get<string>('TOKEN_TIME'),
    });

    const { password: _, ...publicUserData } = user;
    return { user: publicUserData, token };
  }
}
