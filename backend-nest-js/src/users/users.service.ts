import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

// Este servicio maneja la lógica de negocio relacionada con los usuarios
// como la creación, actualización y eliminación de usuarios.
// También maneja la verificación de la existencia de usuarios y el hash de contraseñas.
// Además, se encarga de la interacción con la base de datos a través del repositorio de TypeORM.
// El servicio es inyectable y puede ser utilizado en otros componentes de la aplicación.
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { username, email, password, fullname, level, active } =
      createUserDto;

    // Verificar si el usuario o email ya existe
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      fullname,
      password: hashedPassword,
      level: level ?? 1, // Ajustado al default de la tabla
      active: active ?? 0, // Ajustado al default de la tabla
    });

    return this.userRepository.save(user);
  }

  async findAll(req: any): Promise<Users[]> {
    // Aquí puedes usar req.user para filtrar según el usuario autenticado, si es necesario
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOne(id); // Reutiliza findOne para verificar existencia
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<Users> {
    const user = await this.findOne(id);
    const { password } = changePasswordDto;

    // Hashear la nueva contraseña
    user.password = await bcrypt.hash(password, 10);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
