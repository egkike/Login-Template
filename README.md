# Proyecto Login-Template:
Este es un proyecto que hace un Login-Logout y Administración básica de Usuarios con manejo de sesiones. 

El Backend se encarga de la conexión a la base de datos (API Rest), la creación y actualización de un Token (JWT) para guardar los datos disponibles para la sesión, el uso de una Cookie para mantener el Token durante la sesión y el manejo de errores, utiliando Middlewares. 

El Frontend interactua con el Backend haciendo las peticiones (Axios) a las rutas correspondientes de cada API Rest y muestra los resultados y respuestas en pantalla. Se puede conectar independientemente con cualquiera de ambos Backends de forma transparente.

## Backend-NodeJS:
Backend en NodeJS-Express-JavaScrip que se conecta con base de datos (DB-Local, MySql y PostgreSql) y maneja sesiones de usuarios con JWT y Cookies.

## backend-nest-js:
Backend en NodeJS-NestJS-TypeScrip que se conecta con base de datos PostgreSql y maneja sesiones de usuarios con JWT y Cookies.

## Frontend:
El Frontend tiene la pagina de inicio Login, un menu Sidebar, un Navbar y un menu hamburguesa donde se llama a los formularios de Cambiar Contraseña y Administrar Usuarios (solo si es un usuario Administrador level = 0). 
El Frontend esta hecho en Vite-React-Ts y se puede conectar con cualquiera de ambos Backends.
