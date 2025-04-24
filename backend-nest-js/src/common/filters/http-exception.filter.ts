import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

// Este filtro de excepción se encarga de manejar las excepciones HTTP
// y formatear la respuesta de error de manera consistente.
// Dependiendo del entorno (producción o desarrollo), se pueden mostrar
// diferentes mensajes de error para evitar exponer información sensible.
// En producción, se ocultan los detalles del error interno y se muestra un mensaje genérico.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // Manejar casos donde exceptionResponse tiene una propiedad message
        const message = (exceptionResponse as any).message;
        errorMessage = Array.isArray(message)
          ? message.join(', ')
          : message || 'An error occurred';
      }
    }

    // En producción, no exponer detalles de errores internos
    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception); // Loguear el error para depuración
      errorMessage = 'An unexpected error occurred';
    }

    response.status(status).json({
      statusCode: status,
      error: errorMessage,
    });
  }
}
