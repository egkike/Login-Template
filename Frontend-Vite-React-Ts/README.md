## Paso 1: Configurar el proyecto

1.1. Crear el proyecto con Vite

Ejecuta este comando para iniciar un proyecto React con TypeScript:

```bash
npm create vite@latest Frontend-Vite-React-Ts -- --template react-ts
cd Frontend-Vite-React-Ts
npm install
```

1.2. Instalar Tailwind CSS y otras dependencias

```bash
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss@3.4.1 postcss@8.4.31 autoprefixer@10.4.16 // una version especifica
npx tailwindcss init -p

npm install axios react-router-dom @types/react-router-dom react-icons
```
