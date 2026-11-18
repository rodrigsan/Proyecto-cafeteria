# Instrucciones para Copilot: Sitio web CoffeeHouse

## Rol
Actúa como experto en Angular. Ayúdame a construir el sitio web de CoffeeHouse,
una cafetería premium en Cochabamba, Bolivia, explicando brevemente cada cambio que hagas.

## Stack
- Frontend: Angular (componentes standalone, signals, control flow @if / @for)
- Backend: Node.js + Express + MySQL (API REST en http://localhost:3000/api)
- Chatbot: Ollama con modelo gemma3 (asistente virtual de CoffeeHouse)
- Estilos: CSS propio (sin librerías de pago), paleta oscuro/elegante café

## Diseño
- Paleta: fondos #14100d y #1f1814, textos #f5f2ed, acentos #d4a373 y #c88a4b
- Tipografía: Playfair Display para títulos, Manrope para cuerpo
- Tipografía grande y elegante para títulos
- Cards con bordes muy redondeados
- Diseño responsive (escritorio y móvil)
- Estética premium de cafetería oscura

## Secciones (en este orden)
1. Navbar: logo CoffeeHouse, Inicio, Servicios, Especialidades, Nosotros, Precios, Contacto
2. Portada (Inicio): video de Pexels en bucle con título, subtítulo y botón al menú
3. Servicios: cards desde API /api/servicios
4. Especialidades: cafés estrella desde API /api/especialidades (destacados resaltados)
5. Nosotros: historia, dirección, teléfono, horarios y galería desde API /api/nosotros + /api/galeria-fotos
6. Precios: catálogo agrupado por categoría desde API /api/precios (precios en Bs.)
7. Contacto: formulario con validaciones que envía POST a /api/contactos
8. Footer: enlaces, horarios y contacto desde API /api/nosotros
9. Chatbot: widget flotante conectado a POST /api/chatbot (Ollama gemma3)

## Reglas
- Un componente por sección en src/app/components/
- Cero datos hardcodeados en HTML; todo consumido vía HTTP desde APIs de Node.js
- Código limpio, comentarios breves en español
- Modificar solo los archivos que se pidan
- No usar código ni imágenes de terceros con derechos
- Textos del sitio en español
