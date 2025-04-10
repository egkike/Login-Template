import { Router } from "express";
import { LoginController, UserController } from "../controllers/users.js";

// Se crean los routers para las rutas publicas (login y logout del usuario):
export const createLoginRouter = ({ dbModel }) => {
  const loginRouter = Router();

  const loginController = new LoginController({ dbModel });

  loginRouter.post("/login", loginController.login);
  loginRouter.post("/logout", loginController.logout);

  return loginRouter;
};

// Se crean las rutas protegidas del usuario:
export const createUserRouter = ({ dbModel }) => {
  const usersRouter = Router();

  const userController = new UserController({ dbModel });

  usersRouter.get("/session", userController.getSession);
  usersRouter.get("/users", userController.getUsers);

  usersRouter.post("/user/getbyid", userController.getById);
  usersRouter.post("/user/create", userController.createUser);
  usersRouter.patch("/user/chgpass", userController.chgPassUser);
  usersRouter.patch("/user/update", userController.updUser);
  usersRouter.delete("/user/delete", userController.deleteUser);

  return usersRouter;
};
