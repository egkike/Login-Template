-- Scrips SQL para crear la tabla users en una Base de Datos MySQL:
CREATE TABLE IF NOT EXISTS users (
  _id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
  username VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150) NOT NULL,
  fullname VARCHAR(255) NOT NULL,
  level INT DEFAULT 1 NOT NULL,
  active INT DEFAULT 0 NOT NULL,
  createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX users_email_IDX USING BTREE ON users (email);
CREATE UNIQUE INDEX users_username_IDX USING BTREE ON users (username);

-- Para Insertar el usuario admin con password --> Hash password = Admin1
INSERT INTO users (_id, username, password, email, fullname) VALUES
(UUID_TO_BIN(UUID()), "admin", "$2b$10$K59x//Okkfudik.Cs6jwmeROognDsr./JA90.oeS4cg3l/l.36OaG", "admin@gmail.com", "Usuario Administrador");

-- Para Actualizar el usuario admin con active = 1 y level = 0 (permisos de administrador)
UPDATE users SET level = 0, active = 1 WHERE username = 'admin';

-- Para hacer un Select de la tabla users:
SELECT BIN_TO_UUID(_id), username, password, email, fullname, level, active, createdate
FROM users;
