import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers() {
    const users = await this.userRepository.find({
      select: [
        'id',
        'username',
        'email',
        'fullname',
        'level',
        'active',
        'createdate',
      ],
    });
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'fullname',
        'level',
        'active',
        'createdate',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { username, email, password, fullname } = createUserDto;

    // Verificar si el username ya existe
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      fullname,
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...publicData } = savedUser;
    return publicData;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'fullname',
        'level',
        'active',
        'createdate',
      ],
    });
    return updatedUser;
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.password, 10);
    await this.userRepository.update(id, {
      password: hashedPassword,
      active: 1,
    });

    const updatedUser = await this.userRepository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'fullname',
        'level',
        'active',
        'createdate',
      ],
    });
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
}
