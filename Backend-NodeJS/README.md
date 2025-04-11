# Ejemplo de Autenticación de Usuario, Sesión, Cookies y JWT con Node.js

## Puedes Ver los videos del curso de Midudev que hice:
https://www.youtube.com/watch?v=UqnnhAZxRac

https://www.youtube.com/watch?v=DxYAcXiy-ak

---

## Pasos para iniciar el proyecto:

01- Crear una Carpeta para el proyecto y abrir la carpeta en VSC.

02- Abrir el Terminal desde VSC y ejecutar (se crea el package.json):

  $ npm init -y

03- Luego Instalar los paquetes o dependencias de PRODUCCION, ejecutando:

  $ npm i express dotenv cors bcrypt zod -E

  $ npm i jsonwebtoken    // para manejo del Token de Sesion de usuarios

  $ npm i cookie-parser   // para utilizar Cookies y guardar el Token

  $ npm i db-local        // Instalar la libreria de DBlocal

  $ npm i mysql2          // Instalar la libreria de MySQL

  $ npm i pg              // Instalar la libreria de PostgreSQL

04- Para pasar de commonJS(require) a ESM(import) cambiar en el package.json:
  "type": "module",

05- Para crear la tabla users en una base de datos utilice los scrip-MySql.sql y/o scrip-Postgre.sql.
  Si quieres utilizar DB-Local ya se encuentra creado el archivo Users.json con el usuario admin y password Admin1 en la carpeta db. 
  Luego debes crear un archivo .env con los datos de conexion a tu base de datos MySql o Postgre.

06- Para ejecutar el proyecto utiliza los scrip definidos en package.json que correspondan a la base de datos que vas a utilizar. Ej.: npm run start:local

---

## Yo utilicè una base de datos PostgreSQL en un Docker:
### Para crear una base de datos PostgreSQL en un Docker, en linea de comandos ejecute:

$ docker run -d --name docker-bd-postgresql -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=MiPassword -e POSTGRES_DB=postgres -v pg_datos:/var/lib/postgresql/data postgres:latest

Esto Levanta la base de datos:
$ docker start docker-bd-postgresql 

Esto Baja la base de datos:
$ docker stop docker-bd-postgresql  
