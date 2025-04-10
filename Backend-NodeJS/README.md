# Ejemplo de Autenticación de Usuario, Sesión, Cookies y JWT con Node.js

## Puedes Ver los videos del curso de Midudev que hice en:
https://www.youtube.com/watch?v=UqnnhAZxRac

https://www.youtube.com/watch?v=DxYAcXiy-ak

---

01- Crear una Carpeta para el proyecto y abrir la carpeta en VSC.

02- Abrir el Terminal desde VSC y ejecutar (se crea el package.json):
npm init -y

03- Luego Instalar los paquetes o dependencias de PRODUCCION, ejecutando:
$ npm i express dotenv cors bcrypt zod -E
$ npm i jsonwebtoken    // para manejo de Sesiones de usuarios
$ npm i cookie-parser   // para utilizar Cookies y guardar el Token
$ npm i db-local        // Instalar la libreria de DBlocal
$ npm i mysql2          // Instalar la libreria de MySQL
$ npm i pg              // Instalar la libreria de PostgreSQL

04- Para pasar de commonJS(require) a ESM(import) cambiar en el package.json:
  "type": "module",

---

# Scrips SQL para crear la tabla users en una Base de Datos MySql:

 CREATE TABLE IF NOT EXISTS users (
  _id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  username VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  level INT DEFAULT 1 NOT NULL;
  active INT DEFAULT 0 NOT NULL,
  createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

CREATE UNIQUE INDEX users_email_IDX USING BTREE ON users (email);
CREATE UNIQUE INDEX users_username_IDX USING BTREE ON users (username);

-- Hash password = Admin1
INSERT INTO users (_id, username, password, email, fullname) VALUES
(UUID_TO_BIN(UUID()), "admin", "$2b$10$K59x//Okkfudik.Cs6jwmeROognDsr./JA90.oeS4cg3l/l.36OaG", "admin@gmail.com", "Usuario Administrador");

## Para hacer un Select de la tabla users:
SELECT BIN_TO_UUID(_id), username, password, email, fullname, level, active, createdate
FROM users;

---

## Yo utilicè una base de datos PostgreSQL en un Docker:

# Para crear una base de datos PostgreSQL en un Docker, en linea de comandos ejecute:
$ docker run -d --name docker-bd-postgresql -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=MiPassword -e POSTGRES_DB=postgres -v pg_datos:/var/lib/postgresql/data postgres:latest

$ docker start docker-bd-postgresql // Esto Levanta la base de datos
$ docker stop docker-bd-postgresql  // Esto Baja la base de datos

---

# Scrips SQL para crear la tabla users en una Base de Datos PostgreSQL:

-- Crear la extencion para habilitar uuid_generate_v4() en PostgreSQL:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; // Esto es para habilitar el UUID en Postgre
--------------------------------------------------

CREATE TABLE users (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
username VARCHAR(20) NOT null,
password VARCHAR(255) NOT null,
email VARCHAR(150) NOT null,
fullname VARCHAR(255),
level INT DEFAULT 1 NOT null,
active INT DEFAULT 0 NOT NULL,
createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX users_username_idx ON public.users (username);
CREATE UNIQUE INDEX users_email_idx ON public.users (email);

-- Hash password = Admin1
INSERT INTO users (username, password, email, fullname) VALUES 
('admin', '$2b$10$K59x//Okkfudik.Cs6jwmeROognDsr./JA90.oeS4cg3l/l.36OaG', 'admin@gmail.com', 'Usuario Administrador');

UPDATE users SET level = 0, active = 1 WHERE username = 'admin';

SELECT * FROM users;
