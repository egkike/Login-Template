import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

// Este filtro de excepción maneja las excepciones HTTP lanzadas por el servidor
// y formatea la respuesta de error de manera uniforme.
// En producción, no se exponen detalles de errores internos al cliente.
// En su lugar, se registra el error en el servidor para depuración.
// En desarrollo, se proporciona información detallada sobre el error al cliente.
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
        'message' in exceptionResponse
      ) {
        errorMessage = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : exceptionResponse.message;
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
