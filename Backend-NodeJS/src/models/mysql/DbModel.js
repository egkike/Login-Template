import mysql from "mysql2/promise";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } from "../../config.js";
import { login, getUsers, getById, createUser, chgPassUser, updUser, deleteUser } from "./methods/users.js";

const connectionString = process.env.DATABASE_URL ?? {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
};

const connection = await mysql.createConnection(connectionString);

export class DbModel {
  // METODOS PARA LA TABLA users:
  static async login({ input }) {
    return login({ connection, input });
  }

  static async getUsers() {
    return getUsers({ connection });
  }

  static async getById({ id }) {
    return getById({ connection, id });
  }

  static async createUser({ input }) {
    return createUser({ connection, input });
  }

  static async chgPassUser({ id, input }) {
    return chgPassUser({ connection, id, input });
  }

  static async updUser({ id, input }) {
    return updUser({ connection, id, input });
  }

  static async deleteUser({ id }) {
    return deleteUser({ connection, id });
  }
}
