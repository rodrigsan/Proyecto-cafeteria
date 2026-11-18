# API backend

API REST en Express para las tablas MySQL `usuarios`, `productos` y `hitos`.

Consulta la [documentación detallada de endpoints](./API.md).

## Configuración

Requiere Node.js y una base MySQL. Crea la base y ejecuta
[`database/schema.sql`](./database/schema.sql) dentro de ella antes de iniciar.
Copia `.env.example` a `.env` en la raíz del proyecto y configura allí la
conexión. El archivo `.env` real está excluido del control de versiones.

| Variable | Predeterminado | Descripción |
| --- | --- | --- |
| `DB_HOST` | `127.0.0.1` | Host de MySQL |
| `DB_PORT` | `3306` | Puerto de MySQL |
| `DB_USER` | `root` | Usuario de MySQL |
| `DB_PASSWORD` | vacío | Contraseña de MySQL |
| `DB_NAME` | — | Nombre obligatorio de la base de datos |
| `HOST` | `127.0.0.1` | Interfaz donde escucha la API |
| `PORT` | `3000` | Puerto HTTP |
| `CORS_ORIGINS` | `http://localhost:4200,http://127.0.0.1:4200` | Orígenes web autorizados, separados por comas |

Para permitir que una aplicación web consuma la API, configura `CORS_ORIGINS`
con los orígenes exactos del frontend (protocolo, host y puerto, sin ruta).
Por ejemplo: `CORS_ORIGINS=http://localhost:4200,https://mi-sitio.example`.
Los orígenes no autorizados reciben `403`; las solicitudes sin cabecera
`Origin`, como las llamadas directas de herramientas de consola, no están
afectadas.

Instala dependencias con `npm install` e inicia con `npm start` (o `npm run dev`
durante el desarrollo). La aplicación carga `.env` desde la raíz del proyecto
y comprueba la conexión MySQL antes de abrir el puerto.

## Rutas

Todas las rutas usan JSON. Las rutas de usuarios no devuelven la contraseña;
las contraseñas recibidas se guardan con hash bcrypt.

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/api/health` | Comprueba el estado del servidor |
| `GET` | `/api/usuarios` | Lista usuarios |
| `GET` | `/api/usuarios/:id` | Obtiene un usuario |
| `POST` | `/api/usuarios` | Crea usuario: `{ "nombre", "email", "contraseña" }` |
| `POST` | `/api/usuarios/login` | Valida credenciales: `{ "email", "contraseña" }` |
| `PUT` | `/api/usuarios/:id` | Actualiza campos enviados del usuario |
| `DELETE` | `/api/usuarios/:id` | Elimina usuario |
| `GET` | `/api/productos` | Lista productos |
| `GET` | `/api/productos/:id` | Obtiene un producto |
| `POST` | `/api/productos` | Crea producto con `precio` obligatorio |
| `PUT` | `/api/productos/:id` | Actualiza campos enviados del producto |
| `DELETE` | `/api/productos/:id` | Elimina producto |
| `GET` | `/api/hitos` | Lista hitos |
| `GET` | `/api/hitos/getAll` | Recupera todos los campos de todos los hitos |
| `GET` | `/api/hitos/:id` | Obtiene un hito |
| `POST` | `/api/hitos` | Crea hito: `{ "fecha", "titulo", "descripcion", "imagen", "video", "voz" }` |
| `PUT` | `/api/hitos/:id` | Actualiza campos enviados del hito |
| `DELETE` | `/api/hitos/:id` | Elimina hito |
| `GET` | `/api/hitos-chaco` | Lista los hitos históricos del Chaco |
| `GET` | `/api/hitos-chaco/:id` | Obtiene un hito histórico del Chaco |
| `POST` | `/api/hitos-chaco` | Crea un hito; requiere `codigo_linea_tiempo` y `titulo` |
| `PUT` | `/api/hitos-chaco/:id` | Actualiza los campos enviados del hito |
| `DELETE` | `/api/hitos-chaco/:id` | Elimina un hito histórico del Chaco |
| `POST` | `/api/chatbot` | Consulta al asistente multimedia de la Guerra del Chaco: `{ "prompt": "..." }` |
| `POST` | `/ollama-prompt` | Alias compatible con el endpoint anterior del chatbot |

### Hitos del Chaco

La API `/api/hitos-chaco` usa la tabla `hitos_chaco`, definida en
[`database/schema.sql`](./database/schema.sql). El objeto de un hito contiene
`id`, `codigo_linea_tiempo`, `titulo`, `fecha`, `ubicacion`, `bajas`,
`comandantes`, `descripcion`, `texto`, `foto`, `video` y `voz`.
`comandantes` es un arreglo de textos; los demás campos de contenido son
textos, y `id` es un entero positivo.

`codigo_linea_tiempo` y `titulo` son obligatorios al crear un hito. Los campos
de texto pueden omitirse o ser `null`; si se envía `comandantes`, debe ser un
arreglo de textos o `null`. Los endpoints responden `400` ante identificadores
o cuerpos no válidos, `404` cuando el hito no existe, `409` si el código de
línea de tiempo ya está registrado y `500` ante errores internos.

### Colección de pruebas de Postman

La colección importable está en
[`postman/hitos-chaco.postman_collection.json`](./postman/hitos-chaco.postman_collection.json).
Incluye pruebas de listar, crear, obtener, actualizar y eliminar, además de
validar la respuesta `404` tras borrar y el error `400` para un id inválido.
La prueba CRUD crea un registro temporal con código único y lo elimina al
final; no modifica los hitos existentes.

Para ejecutarla en Postman:

1. Inicia el backend (`npm start`) con MySQL accesible y la tabla
   `hitos_chaco` creada.
2. Importa el archivo de colección desde **Import**.
3. En **Variables** de la colección, ajusta `baseUrl` si la API no está en
   `http://127.0.0.1:3000`.
4. Ejecuta la carpeta **CRUD Hitos Chaco** en Collection Runner.

También se puede ejecutar desde la raíz de `backend` con Postman CLI:

```powershell
postman.cmd collection run .\postman\hitos-chaco.postman_collection.json
```

La colección realiza las solicitudes en orden y ejecuta aserciones de estado y
contenido en cada respuesta. El inicio de sesión en Postman CLI solo es
necesario para publicar los resultados en la nube de Postman.

El login responde `200` con los datos públicos del usuario si las credenciales
son correctas, `401` si no coinciden y `400` si faltan campos o no son válidos.
No devuelve la contraseña ni emite un token de sesión.

El chatbot requiere Ollama disponible en `OLLAMA_URL` (predeterminado
`http://127.0.0.1:11434`) y usa el modelo `OLLAMA_MODEL` (predeterminado
`gemma3`). El endpoint acepta prompts de hasta 4000 caracteres y responde
`{ "response": "..." }`. El asistente está orientado a la historia y al contenido
educativo multimedia de la Guerra del Chaco entre Bolivia y Paraguay.
