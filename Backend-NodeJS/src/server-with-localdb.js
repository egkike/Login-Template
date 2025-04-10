import { createApp } from "./app.js";
import { DbModel } from "./models/local-db/DbModel.js";

createApp({ dbModel: DbModel }); // Se inyecta el modelo de la base de datos local a app.js
