import { createApp } from "./app.js";
import { DbModel } from "./models/mysql/DbModel.js";

createApp({ dbModel: DbModel }); // Se inyecta el modelo de la base de datos MySql a app.js
