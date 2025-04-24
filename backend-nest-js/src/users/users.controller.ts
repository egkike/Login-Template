import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('session')
  async getSession(@Req() req: Request) {
    const tokenData = (req as any).session?.tokenData;
    if (!tokenData) {
      return { error: (req as any).session?.error || 'Unauthorized' };
    }
    return tokenData;
  }

  @Get('users')
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Post('user/getbyid')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getById(@Body('id') id: string) {
    return this.usersService.getById(id);
  }

  @Post('user/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('user/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUser(
    @Body('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch('user/chgpass')
  @UsePipes(new ValidationPipe({ transform: true }))
  async changePassword(
    @Body('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete('user/delete')
  async deleteUser(@Body('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
