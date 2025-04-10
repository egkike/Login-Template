import express, { json } from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middlewares/cors.js";
import { loginLimiter } from "./middlewares/rateLimiter.js";
import { sessionMiddleware } from "./middlewares/session.js";
import { HTTP, PORT } from "./config.js";
import { createLoginRouter, createUserRouter } from "./routes/users.js";

// Se envuelve la app en una función (createApp) para poder inyectar dependencias
export const createApp = ({ dbModel }) => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");
  app.use(cookieParser());

  // Middleware que aplica el limitador solo en la ruta de login
  app.use("/api/login", loginLimiter);

  // Rutas públicas de la app (Login y Logout)
  app.use("/api", createLoginRouter({ dbModel }));

  // Middleware para verificar el token de sesión y refrescarlo.(para rutas protegidas)
  app.use(sessionMiddleware);

  // Rutas protegidas de la app
  app.use("/api", createUserRouter({ dbModel }));

  // Middleware para manejar errores
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  });

  // Middleware para manejar rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({ error: "Route Not Found" });
  });

  // Inicia el servidor en el puerto y host especificado
  app.listen(PORT, () => {
    console.log(`Server listening at ${HTTP}:${PORT}`);
  });
};
