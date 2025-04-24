import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// El decorador @Controller() se utiliza para definir un controlador en NestJS.
// El controlador maneja las solicitudes HTTP y devuelve respuestas.
// El controlador puede tener múltiples métodos que manejan diferentes rutas y métodos HTTP.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
