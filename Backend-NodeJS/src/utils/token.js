import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY, TOKEN_TIME } from "../config.js";

// Función para generar un nuevo token
export const generateNewToken = (data) => {
  return jwt.sign(data, SECRET_JWT_KEY, { expiresIn: TOKEN_TIME });
};

// Función para verificar si un token es válido
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_JWT_KEY);
  } catch (error) {
    return null;
  }
};
