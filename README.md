# 🎬 Movie API

Una API RESTful para gestionar películas y series, construida con **NestJS**, **MongoDB**, y autenticación **JWT**. Documentada con **Swagger** y probada con **Jest**.

---

## 🚀 Tecnologías principales

| Herramienta        | Descripción                                   |
|--------------------|-----------------------------------------------|
| 🧠 NestJS          | Framework progresivo para construir APIs      |
| 🍃 Mongoose        | ODM para MongoDB                              |
| 🛡️ JWT             | Autenticación segura con JSON Web Tokens     |
| 📘 Swagger         | Documentación interactiva de la API          |
| 🧪 Jest            | Framework para pruebas unitarias              |
| 🎯 ESLint + Prettier | Linter y formateador de código               |

---

## 📦 Scripts disponibles

| Comando              | Descripción                                        |
|----------------------|----------------------------------------------------|
| `npm run start`      | Inicia el servidor en modo producción              |
| `npm run start:dev`  | Inicia el servidor en modo desarrollo (watch mode) |
| `npm run lint`       | Ejecuta el linter con ESLint                       |
| `npm run format`     | Formatea el código con Prettier                    |
| `npm run test`       | Ejecuta los tests unitarios con Jest               |
| `npm run test:cov`   | Ejecuta los tests y muestra el reporte de cobertura|

---

## ▶️ Cómo iniciar el servidor

1. Instala las dependencias:

    ```bash
    npm install
    ```

2. Crea un archivo `.env` con tus variables necesarias:

    ```env
    MONGO_URI=mongodb://localhost:27017/movie-api
    JWT_SECRET=supersecret
    PORT=3000
    ```

3. Inicia la API en modo desarrollo:

    ```bash
    npm run start:dev
    ```

---

## 🛠️ Estructura base del proyecto

```bash
src/
├── auth/              # Módulo de autenticación (JWT, guards, etc)
├── users/             # Gestión de usuarios
├── movies/            # Gestión de películas y series
├── common/            # DTOs, validaciones, middlewares
├── main.ts            # Punto de entrada
├── app.module.ts      # Módulo raíz
└── ...
```

---

## 🧪 Ejecutar tests

Para correr las pruebas unitarias:

```bash
npm run test
```

---

## 📊 Ver reporte de cobertura

```bash
npm run test:cov
```

---

## 📚 Swagger - Documentación de la API

Una vez el servidor esté corriendo, puedes acceder a la documentación Swagger desde:

```bash
http://localhost:3000/api
```
Allí podrás explorar todos los endpoints disponibles, probar peticiones y ver los esquemas definidos.

---

## 👨‍💻 Autor

Desarrollado por Misael A. Martínez Ramos 🧑‍💻
