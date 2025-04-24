import { Injectable } from '@nestjs/common';

// Este servicio es un ejemplo de cómo se puede crear un servicio en NestJS.
// En este caso, el servicio simplemente devuelve un saludo.
// Puedes inyectar este servicio en otros controladores o servicios para reutilizar la lógica.
// Puedes agregar más métodos y lógica según sea necesario para tu aplicación.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
