import pkg from "pg";
const { Pool, types } = pkg; // Desestructuramos 'types' para configurar el parseo
import { DB_HOST, DB_USER, DB_PASSWORD, DB_PORT, DB_NAME } from "../../config.js";
import { login, getUsers, getById, createUser, chgPassUser, updUser, deleteUser } from "./methods/users.js";

// Configurar el parseo de NUMERIC/DECIMAL como números
types.setTypeParser(types.builtins.NUMERIC, parseFloat);

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Permite conexiones SSL sin verificar el certificado
  },
});

export class DbModel {
  // LLAMA LOS METODOS DE LA TABLA users:
  static async login({ input }) {
    return login({ pool, input });
  }

  static async getUsers() {
    return getUsers({ pool });
  }

  static async getById({ id }) {
    return getById({ pool, id });
  }

  static async createUser({ input }) {
    return createUser({ pool, input });
  }

  static async chgPassUser({ id, input }) {
    return chgPassUser({ pool, id, input });
  }

  static async updUser({ id, input }) {
    return updUser({ pool, id, input });
  }

  static async deleteUser({ id }) {
    return deleteUser({ pool, id });
  }
}