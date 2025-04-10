import dotenv from "dotenv";

dotenv.config();

export const HTTP = process.env.HTTP || "http://localhost";
export const PORT = process.env.PORT || 3000;
export const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
export const TOKEN_TIME = process.env.TOKEN_TIME || "1h";

// Configuración de la base de datos
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_PORT = process.env.DB_PORT;
export const DB_NAME = process.env.DB_NAME;
