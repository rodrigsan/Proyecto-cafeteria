const CONTEXTO_COFFEEHOUSE = `
Eres el asistente virtual de soporte de "CoffeeHouse", una cafetería premium ubicada en Cochabamba, Bolivia.
Tu función es responder preguntas de los clientes sobre la cafetería, su menú, precios, servicios, ubicación y horarios.

INFORMACIÓN DE COFFEEHOUSE:
- Nombre: CoffeeHouse
- Ubicación: Av. Heroínas esq. San Martín, zona Centro, Cochabamba, Bolivia
- Teléfono: +591 4 4256789
- Correo: hola@coffeehouse.bo
- Horarios: Lunes a viernes de 07:30 a 20:00, Sábado de 08:00 a 19:00, Domingo de 09:00 a 18:00

MENÚ Y PRECIOS (en Bs. - bolivianos):
Bebidas Calientes: Espresso Bs 12.00, Americano Bs 14.00, Cappuccino Bs 18.00, Latte Bs 20.00, Mocaccino Bs 22.00
Bebidas Frías: Café frappé Bs 20.00, Cold brew Bs 18.00, Té helado Bs 12.00, Latte helado vainilla Bs 22.00
Especialidades: Café de altura Cochabamba Bs 16.00, Affogato Bs 24.00
Repostería: Tiramisú clásico Bs 28.00, Cheesecake de frutos rojos Bs 26.00, Brownie de chocolate Bs 20.00

SERVICIOS:
- Café de especialidad: granos seleccionados preparados por baristas
- Desayunos y brunch: tostadas, avena, huevos y jugos naturales
- Repostería artesanal: dulces, tortas y galletas hechas en casa
- Espacio de trabajo remoto: Wi-Fi, enchufes y ambiente tranquilo
- Eventos privados: reuniones, cumpleaños y encuentros de trabajo

ESPECIALIDADES DE LA CASA:
- Café de altura Cochabamba: cultivo en valles cochabambinos, notas cítricas
- Espresso doble: extracción intensa y equilibrada
- Cappuccino italiano: leche vaporizada y espuma cremosa con cacao
- Latte vainilla: espresso con leche y jarabe de vainilla natural
- Tiramisú clásico: postre italiano con mascarpone y cacao

REGLAS:
- Responde siempre en español, con claridad, respeto y calidez.
- No inventes precios, productos ni servicios que no estén en la información anterior.
- Si el cliente pregunta sobre algo que no está en esta información, indica amablemente que puedes ayudarle con lo relacionado a CoffeeHouse y sugiere que contacten directamente al teléfono o correo.
- Sé breve y directo en tus respuestas.
`;

const OLLAMA_URL = (
  process.env.OLLAMA_URL || "http://127.0.0.1:11434"
).replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma3";
const OLLAMA_TIMEOUT_MS = 60000;
const MAX_PROMPT_LENGTH = 4000;

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const RESPUESTA_RESPALDO = `
Hola! Soy el asistente virtual de CoffeeHouse, tu cafetería de especialidad en Cochabamba, Bolivia.

📍 Ubicación: Av. Heroínas esq. San Martín, zona Centro, Cochabamba, Bolivia
📞 Teléfono: +591 4 4256789
✉️ Correo: hola@coffeehouse.bo

🕒 Horarios:
- Lunes a viernes: 07:30 – 20:00
- Sábado: 08:00 – 19:00
- Domingo: 09:00 – 18:00

☕ Nuestros precios (en Bs.):
Bebidas Calientes: Espresso Bs 12.00, Americano Bs 14.00, Cappuccino Bs 18.00, Latte Bs 20.00, Mocaccino Bs 22.00
Bebidas Frías: Café frappé Bs 20.00, Cold brew Bs 18.00, Té helado Bs 12.00, Latte helado vainilla Bs 22.00
Especialidades: Café de altura Cochabamba Bs 16.00, Affogato Bs 24.00
Repostería: Tiramisú clásico Bs 28.00, Cheesecake de frutos rojos Bs 26.00, Brownie de chocolate Bs 20.00

Si necesitas más información, contáctanos directamente. ¡Que tengas un excelente día!
`;

async function prompt(req, res) {
  const { prompt: questionPrompt, mensaje } = req.body;
  const question = questionPrompt ?? mensaje;

  if (
    typeof question !== "string" ||
    !question.trim() ||
    question.length > MAX_PROMPT_LENGTH
  ) {
    throw httpError(
      400,
      `El mensaje debe ser un texto no vacío de hasta ${MAX_PROMPT_LENGTH} caracteres`,
    );
  }

  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: CONTEXTO_COFFEEHOUSE,
        prompt: question.trim(),
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Ollama respondió con status ${response.status}`);
    }
    const data = await response.json();

    if (!data || typeof data.response !== "string") {
      throw new Error("Ollama devolvió una respuesta no válida");
    }

    res.json({ response: data.response.trim() });
  } catch (error) {
    if (timedOut) {
      res.json({ response: RESPUESTA_RESPALDO.trim() });
      return;
    }
    res.json({ response: RESPUESTA_RESPALDO.trim() });
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { prompt };
