-- Crear la extencion para habilitar uuid_generate_v4() en PostgreSQL:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

-- Scrips SQL para crear la tabla users en una Base de Datos PostgreSQL:
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

-- Para Insertar el usuario admin con password --> Hash password = Admin1
INSERT INTO users (username, password, email, fullname) VALUES 
('admin', '$2b$10$K59x//Okkfudik.Cs6jwmeROognDsr./JA90.oeS4cg3l/l.36OaG', 'admin@gmail.com', 'Usuario Administrador');

-- Para Actualizar el usuario admin con active = 1 y level = 0 (permisos de administrador)
UPDATE users SET level = 0, active = 1 WHERE username = 'admin';

SELECT * FROM users;
