import { verifyToken, generateNewToken } from "../utils/token.js";

// Este middleware se encarga de verificar el token de sesión
// y de crear un nuevo token si es necesario y de añadir la información del usuario a la petición
export const sessionMiddleware = (req, res, next) => {
  const token = req.cookies.session_token;
  req.session = { tokenData: null };
  if (!token) {
    req.session = { error: "No token provided" };
    return next();
  }
  const tokenData = verifyToken(token);
  if (!tokenData) {
    req.session = { error: "Invalid token" };
    return next();
  }
  req.session.tokenData = tokenData;
  const newData = {
    id: tokenData.id,
    username: tokenData.username,
    email: tokenData.email,
    fullname: tokenData.fullname,
    level: tokenData.level,
    active: tokenData.active,
  };
  const newToken = generateNewToken(newData);
  res.cookie("session_token", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 3600000,
  });
  next();
};
