import cors from "cors";

// Middleware para habilitar CORS
// y permitir el acceso a la API desde diferentes orígenes
// Puedes agregar o quitar orígenes según tus necesidades
const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://www.mipagina.com",
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      console.error(`CORS error: ${origin} not allowed`);
      return callback(null, false);
    },
    credentials: true, // Habilitar withCredentials para cookies y autenticación
  });
