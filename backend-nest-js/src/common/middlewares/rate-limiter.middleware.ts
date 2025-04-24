import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Este middleware limita el número de peticiones a la API para evitar ataques de fuerza bruta
// y proteger la aplicación de abusos. En este caso, se limita a 5 peticiones por IP cada 15 minutos.
@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por IP
    message: { error: 'Demasiados intentos fallidos, intenta más tarde' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}
