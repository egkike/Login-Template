import { createApp } from "./app.js";
import { DbModel } from "./models/postgresql/DbModel.js";

createApp({ dbModel: DbModel }); // Se inyecta el modelo de la base de datos PostgreSQL a app.js
