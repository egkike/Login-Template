import rateLimit from "express-rate-limit";

// Limitar el número de intentos de inicio de sesión
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos
  max: 5, // Limita cada IP a 5 intentos en la ventana de tiempo
  message: { error: "Demasiados intentos fallidos, intenta más tarde" },
  standardHeaders: true,
  legacyHeaders: false,
});
