import { generateNewToken } from "../utils/token.js";
import { validatePartialUser, validatePassword } from "../schemas/users.js";

// Se crean los controladores para las rutas publicas (login y logout):
export class LoginController {
  constructor({ dbModel }) {
    this.dbModel = dbModel;
  }

  login = async (req, res) => {
    // Evalua si se logeo con email o username
    const input =
      req.body.username === ""
        ? { email: req.body.email, password: req.body.password }
        : { username: req.body.username, password: req.body.password };
    const input3 =
      req.body.username === ""
        ? { username: "", email: req.body.email, password: req.body.password }
        : {
            username: req.body.username,
            email: "",
            password: req.body.password,
          };
    // Validar que el usuario y contraseña ingresados en pantalla sean correctos
    const result = validatePartialUser(input);
    if (!result.success) {
      const [error] = JSON.parse(result.error.message);
      const message = { error: error.message };
      return res.status(400).json(message);
    }    
    // Acceder al modelo para verificar si el usuario y contraseña son correctos
    const data = await this.dbModel.login({ input: input3 });
    if (data.username) {
      const dataToken = {
        id: data.id,
        username: data.username,
        email: data.email,
        fullname: data.fullname,
        level: data.level,
        active: data.active,
      };
      // Crear un token de sesión JWT
      const token = generateNewToken(dataToken);
      // Retorna el token en la cookie session_token
      res.cookie("session_token", token, {
        httpOnly: true, // la cookie solo se puede leer en el servidor
        secure: process.env.NODE_ENV === "production", // la cookie solo se puede enviar por https
        sameSite: "strict", // la cookie solo se puede enviar si la peticion es del mismo sitio
        path: "/", // la cookie esta disponible en todas las rutas
        maxAge: 3600000, // la cookie expira en 1 hora
      });
      const { password, ...publicData } = data;
      res.status(201).json(publicData);
    } else {
      return res.status(400).json({ error: data.error });
    }
  };

  logout = (req, res) => {
    res.clearCookie("session_token").json({ message: "Logged out" });
  };
}

// Se crean los controladores para las rutas protegidas de la app:
export class UserController {
  constructor({ dbModel }) {
    this.dbModel = dbModel;
  }

  getSession = (req, res) => {
    const tokenData = req.session.tokenData;
    if (!tokenData) {
      return res.status(401).json({ error: req.session.error });
    }
    return res.status(201).json(tokenData);
  };

  getById = async (req, res) => {
    const tokenData = req.session.tokenData;
    if (!tokenData) {
      return res.status(401).json({ error: req.session.error });
    }
    const { id } = req.body;
    const user = await this.dbModel.getById({ id });
    if (user.error) return res.status(404).json({ error: user.error });
    return res.status(201).json(user);
  };

  getUsers = async (req, res) => {
    const tokenData = req.session.tokenData;
    if (!tokenData) {
      return res.status(401).json({ error: req.session.error });
    }
    const users = await this.dbModel.getUsers();
    if (users.error) {
      return res.status(404).json({ error: users.error });
    }
    return res.status(201).json(users);
  };

  createUser = async (req, res) => {
    const tokenData = req.session.tokenData;
    if (!tokenData) {
      return res.status(401).json({ error: req.session.error });
    }
    const result = validatePartialUser(req.body);
    if (!result.success) {
      const [error] = JSON.parse(result.error.message);
      const message = { error: error.message };
      return res.status(400).json(message);
    }

    if (!validatePassword(result.data.password)) {
      return res.status(400).json({
        error:
          "Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number",
      });
    }
    const newUser = await this.dbModel.createUser({ input: result.data });
    if (newUser.error) {
      return res.status(404).json({ error: newUser.error });
    }
    const { password, ...publicData } = newUser;
    return res.status(201).json(publicData);
  };

  updUser = async (req, res) => {
    const tokenData = req.session.tokenData;
    if (!tokenData) {
      return res.status(401).json({ message: req.session.message });
    }
    const { id, fullname, level, active } = req.body;
    const input = { fullname, level, active };
    const result = validatePartialUser(input);
    if (!result.success) {
      const [error] = JSON.parse(result.error.message);
      const message = { error: error.message };
      return res.status(400).json(message);
    }

    const updatedUser = await this.dbModel.updUser({
      id,
      input: result.data,
    });
    if (updatedUser.error) {
      return res.status(404).json({ error: updatedUser.error });
    }
    return res.status(201).json(updatedUser);
  };

  chgPassUser = async (req, res) => {
    const tokenData = req.session.tokenData;
    if (!tokenData) {
      return res.status(401).json({ message: req.session.message });
    }
    const { id, password } = req.body;

    const result = validatePartialUser({ password: password });
    if (!result.success) {
      const [error] = JSON.parse(result.error.message);
      const message = { error: error.message };
      return res.status(400).json(message);
    }
    if (!validatePassword(result.data.password)) {
      return res.status(400).json({
        error:
          "Password must contain at least 6 characters, 1 lowercase, 1 uppercase, 1 number",
      });
    }
    const chgPassUser = await this.dbModel.chgPassUser({
      id,
      input: result.data,
    });
    if (chgPassUser.error) {
      return res.status(404).json({ error: chgPassUser.error });
    }
    return res.status(201).json(chgPassUser);
  };

  deleteUser = async (req, res) => {
    const tokenData = req.session.tokenData;
    if (!tokenData) {
      return res.status(401).json({ error: req.session.message });
    }
    const { id } = req.body;
    const result = await this.dbModel.deleteUser({ id });
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    return res.status(201).json({ message: result.success });
  };
}
