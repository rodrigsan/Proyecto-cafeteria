# Documentación de la API

API REST desarrollada con Express y MySQL. Salvo que se indique lo contrario,
las respuestas con contenido se devuelven en JSON.

## Conexión

- URL local predeterminada: `http://127.0.0.1:3000`
- Todas las rutas de la API, excepto el alias del chatbot, comienzan con `/api`.
- Para solicitudes `POST` y `PUT`, envía `Content-Type: application/json` y un
  objeto JSON como cuerpo.
- Los cuerpos JSON deben tener como máximo 1 MB. Los endpoints no requieren
  autenticación.
- CORS permite por defecto `http://localhost:4200` y
  `http://127.0.0.1:4200`. Para otros frontends, configura `CORS_ORIGINS` como
  una lista de orígenes exactos separados por comas (por ejemplo,
  `https://mi-sitio.example`). Los orígenes no permitidos reciben `403`.

## Respuestas de error

Los errores se devuelven con esta estructura:

```json
{
  "error": "Descripción del error"
}
```

| Código | Significado |
| --- | --- |
| `400` | Solicitud inválida, datos no válidos o identificador incorrecto |
| `401` | Credenciales incorrectas al iniciar sesión |
| `404` | Ruta o registro no encontrado |
| `409` | Conflicto con un registro existente, como un email o código duplicado |
| `500` | Error interno del servidor |
| `502` | Error de conexión o respuesta no válida del servicio de IA |
| `504` | El servicio de IA excedió el tiempo de espera |

Un identificador `:id` debe ser un entero positivo. Las operaciones de
eliminación exitosas responden `204 No Content` sin cuerpo.

## Estado del servicio

### `GET /api/health`

Comprueba que el servidor está activo.

**Respuesta `200`:**

```json
{
  "status": "ok"
}
```

## Usuarios

Los datos públicos de usuario incluyen `id`, `nombre`, `email`,
`fecha_creacion` y `fecha_actualizacion`. La contraseña nunca se devuelve y se
almacena como hash.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/usuarios` | Lista usuarios |
| `GET` | `/api/usuarios/:id` | Obtiene un usuario |
| `POST` | `/api/usuarios` | Crea un usuario |
| `POST` | `/api/usuarios/login` | Valida credenciales |
| `PUT` | `/api/usuarios/:id` | Actualiza los campos enviados |
| `DELETE` | `/api/usuarios/:id` | Elimina un usuario |

### Crear usuario

`nombre`, `email` y `contraseña` son obligatorios. El nombre tiene un máximo
de 100 caracteres; el email debe tener formato válido y no superar 100
caracteres.

```json
{
  "nombre": "Ana Pérez",
  "email": "ana@example.com",
  "contraseña": "mi-clave"
}
```

Responde `201 Created` con el usuario público. Si el email ya existe, responde
`409 Conflict`.

### Iniciar sesión

```json
{
  "email": "ana@example.com",
  "contraseña": "mi-clave"
}
```

Responde `200 OK` si las credenciales coinciden:

```json
{
  "mensaje": "Inicio de sesión exitoso",
  "usuario": {
    "id": 1,
    "nombre": "Ana Pérez",
    "email": "ana@example.com",
    "fecha_creacion": "2026-11-04T17:00:00.000Z",
    "fecha_actualizacion": "2026-11-04T17:00:00.000Z"
  }
}
```

Responde `401 Unauthorized` para credenciales incorrectas. Este endpoint no
emite un token de sesión.

### Actualizar usuario

Se puede enviar uno o más de estos campos: `nombre`, `email` y `contraseña`.
Las validaciones son las mismas que al crear. Responde `200 OK` con el usuario
actualizado.

## Productos

Cada producto contiene `id`, `titulo`, `descripcion`, `imagen` y `precio`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/productos` | Lista productos |
| `GET` | `/api/productos/:id` | Obtiene un producto |
| `POST` | `/api/productos` | Crea un producto |
| `PUT` | `/api/productos/:id` | Actualiza los campos enviados |
| `DELETE` | `/api/productos/:id` | Elimina un producto |

### Crear producto

Los textos son opcionales y pueden ser `null`; si se envían, admiten hasta
100 caracteres. `precio` es obligatorio: número entre `0` y `99999999.99`, con
hasta dos decimales.

```json
{
  "titulo": "Libro",
  "descripcion": "Edición ilustrada",
  "imagen": "https://ejemplo.com/libro.jpg",
  "precio": 29.9
}
```

Responde `201 Created` con el producto creado. Para actualizar, envía al menos
uno de los campos del producto.

## Hitos

Cada hito contiene `id`, `fecha`, `titulo`, `descripcion`, `imagen`, `video` y
`voz`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/hitos` | Lista todos los hitos |
| `GET` | `/api/hitos/getAll` | Alias de la lista completa |
| `GET` | `/api/hitos/:id` | Obtiene un hito |
| `POST` | `/api/hitos` | Crea un hito |
| `PUT` | `/api/hitos/:id` | Actualiza los campos enviados |
| `DELETE` | `/api/hitos/:id` | Elimina un hito |

Los campos de texto son opcionales y pueden ser `null`; los textos admiten
hasta 100 caracteres. `fecha` acepta `YYYY-MM-DD` o
`YYYY-MM-DD HH:mm:ss` (también se admite `T` como separador de fecha y hora).

```json
{
  "fecha": "1932-06-15",
  "titulo": "Inicio del conflicto",
  "descripcion": "Descripción del acontecimiento",
  "imagen": "https://ejemplo.com/hito.jpg",
  "video": null,
  "voz": null
}
```

Responde `201 Created` al crear. Para actualizar, envía al menos un campo.

## Hitos del Chaco

La ruta `/api/hitos-chaco` trabaja con la tabla `hitos_chaco`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/hitos-chaco` | Lista hitos en orden de `id` |
| `GET` | `/api/hitos-chaco/:id` | Obtiene un hito |
| `POST` | `/api/hitos-chaco` | Crea un hito |
| `PUT` | `/api/hitos-chaco/:id` | Actualiza los campos enviados |
| `DELETE` | `/api/hitos-chaco/:id` | Elimina un hito |

Campos:

| Campo | Tipo | Requerido al crear | Validación |
| --- | --- | --- | --- |
| `codigo_linea_tiempo` | texto | Sí | No vacío; máximo 100 caracteres; único |
| `titulo` | texto | Sí | No vacío; máximo 255 caracteres |
| `fecha` | texto o `null` | No | Máximo 100 caracteres |
| `ubicacion` | texto o `null` | No | Máximo 255 caracteres |
| `bajas` | texto o `null` | No | Máximo 65.535 caracteres |
| `comandantes` | arreglo de textos o `null` | No | Cada elemento admite hasta 255 caracteres |
| `descripcion` | texto o `null` | No | Máximo 65.535 caracteres |
| `texto` | texto o `null` | No | Máximo 4.294.967.295 caracteres, sujeto al límite del cuerpo HTTP |
| `foto` | texto o `null` | No | Máximo 255 caracteres |
| `video` | texto o `null` | No | Máximo 255 caracteres |
| `voz` | texto o `null` | No | Máximo 255 caracteres |

Ejemplo de creación:

```json
{
  "codigo_linea_tiempo": "1932-inicio",
  "titulo": "Inicio de la Guerra del Chaco",
  "fecha": "15 de junio de 1932",
  "ubicacion": "Chaco Boreal",
  "bajas": null,
  "comandantes": ["Comandante de ejemplo"],
  "descripcion": "Descripción breve del hito.",
  "texto": "Texto ampliado del acontecimiento.",
  "foto": null,
  "video": null,
  "voz": null
}
```

La respuesta de creación es `201 Created` e incluye el registro creado con su
`id`. Si el código de línea de tiempo ya está registrado, responde
`409 Conflict`. Para actualizar, envía uno o más campos y no dejes vacíos
`codigo_linea_tiempo` ni `titulo`.

## Chatbot

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/chatbot` | Envía una pregunta al asistente histórico |
| `POST` | `/ollama-prompt` | Alias compatible |

El cuerpo debe incluir un `prompt` no vacío de hasta 4.000 caracteres:

```json
{
  "prompt": "¿Cuáles fueron las causas de la Guerra del Chaco?"
}
```

Responde `200 OK`:

```json
{
  "response": "Respuesta del asistente."
}
```

El asistente está orientado al contenido educativo sobre la Guerra del Chaco.
Necesita que Ollama esté disponible. Configuración opcional:

| Variable | Predeterminado | Descripción |
| --- | --- | --- |
| `OLLAMA_URL` | `http://127.0.0.1:11434` | URL del servicio Ollama |
| `OLLAMA_MODEL` | `gemma3` | Modelo usado para generar respuestas |

## Ejemplos con `curl`

```sh
# Comprobar el servicio
curl http://127.0.0.1:3000/api/health

# Listar hitos del Chaco
curl http://127.0.0.1:3000/api/hitos-chaco

# Crear un hito del Chaco
curl -X POST http://127.0.0.1:3000/api/hitos-chaco \
  -H "Content-Type: application/json" \
  -d '{"codigo_linea_tiempo":"1932-inicio","titulo":"Inicio de la Guerra del Chaco"}'
```

## Base de datos y pruebas

La estructura SQL está definida en
[`database/schema.sql`](./database/schema.sql). El script
[`database/seed-hitos-chaco.js`](./database/seed-hitos-chaco.js) crea la tabla
`hitos_chaco` si hace falta y carga o actualiza los registros de
`database/hitos.json`.

Para ejemplos de pruebas CRUD de hitos del Chaco, consulta la colección
[`postman/hitos-chaco.postman_collection.json`](./postman/hitos-chaco.postman_collection.json).
