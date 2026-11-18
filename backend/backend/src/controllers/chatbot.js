const preciosModel = require("../models/precios");
const especialidadesModel = require("../models/especialidades");
const serviciosModel = require("../models/servicios");
const nosotrosModel = require("../models/nosotros");

const OLLAMA_URL = (
  process.env.OLLAMA_URL || "http://127.0.0.1:11434"
).replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma3:1b";
const OLLAMA_TIMEOUT_MS = 60000;
const MAX_PROMPT_LENGTH = 4000;

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function obtenerDatosDinamicos() {
  const [precios, especialidades, servicios, nosotros] = await Promise.all([
    preciosModel.findAll(),
    especialidadesModel.findAll(),
    serviciosModel.findAll(),
    nosotrosModel.findOne(),
  ]);

  const preciosPorCategoria = {};
  for (const p of precios) {
    if (!preciosPorCategoria[p.categoria]) {
      preciosPorCategoria[p.categoria] = [];
    }
    preciosPorCategoria[p.categoria].push(p);
  }

  let textoPrecios = "";
  for (const [categoria, items] of Object.entries(preciosPorCategoria)) {
    textoPrecios += `\n${categoria}:`;
    for (const item of items) {
      textoPrecios += `\n- ${item.nombre}: Bs. ${Number(item.precio).toFixed(2)}`;
    }
  }

  let textoEspecialidades = "";
  for (const e of especialidades) {
    textoEspecialidades += `\n- ${e.nombre}: ${e.descripcion}`;
  }

  let textoServicios = "";
  for (const s of servicios) {
    textoServicios += `\n- ${s.nombre}: ${s.descripcion}`;
  }

  const horarios = nosotros?.horarios || {};
  const textoHorarios = `
- Lunes a viernes: ${horarios.lunesAViernes || "No disponible"}
- Sábado: ${horarios.sabado || "No disponible"}
- Domingo: ${horarios.domingo || "No disponible"}
`;

  return {
    textoPrecios,
    textoEspecialidades,
    textoServicios,
    direccion: nosotros?.direccion || "No disponible",
    telefono: nosotros?.telefono || "No disponible",
    correo: nosotros?.correo || "No disponible",
    textoHorarios,
  };
}

function construirContexto(datos) {
  return `
Eres el asistente virtual de soporte de "CoffeeHouse", una cafetería premium ubicada en Cochabamba, Bolivia.
Tu función es responder preguntas de los clientes sobre la cafetería, su menú, precios, servicios, ubicación y horarios.

INFORMACIÓN DE COFFEEHOUSE (actualizada en tiempo real desde la base de datos):
- Nombre: CoffeeHouse
- Ubicación: ${datos.direccion}
- Teléfono: ${datos.telefono}
- Correo: ${datos.correo}

HORARIOS DE ATENCIÓN:${datos.textoHorarios}

MENÚ Y PRECIOS (en Bs. - bolivianos):${datos.textoPrecios}

SERVICIOS:${datos.textoServicios}

ESPECIALIDADES DE LA CASA:${datos.textoEspecialidades}

REGLAS:
- Responde siempre en español, con claridad, respeto y calidez.
- Usa EXCLUSIVAMENTE los precios, productos y servicios listados arriba, que provienen de la base de datos actual.
- No inventes precios, productos ni servicios que no estén en la información anterior.
- Si el cliente pregunta sobre algo que no está en esta información, indica amablemente que puedes ayudarle con lo relacionado a CoffeeHouse y sugiere que contacten directamente al teléfono o correo.
- Sé breve y directo en tus respuestas.
`;
}

function construirRespuestaRespaldo(datos) {
  return `
Hola! Soy el asistente virtual de CoffeeHouse, tu cafetería de especialidad en Cochabamba, Bolivia.

📍 Ubicación: ${datos.direccion}
📞 Teléfono: ${datos.telefono}
✉️ Correo: ${datos.correo}

🕒 Horarios:${datos.textoHorarios}

☕ Nuestros precios (en Bs.):${datos.textoPrecios}

Si necesitas más información, contáctanos directamente. ¡Que tengas un excelente día!
`;
}

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

  let datos;
  try {
    datos = await obtenerDatosDinamicos();
  } catch (error) {
    console.error("Error consultando base de datos:", error.message);
    datos = {
      textoPrecios: "",
      textoEspecialidades: "",
      textoServicios: "",
      direccion: "No disponible",
      telefono: "No disponible",
      correo: "No disponible",
      textoHorarios: "\n- Lunes a viernes: No disponible\n- Sábado: No disponible\n- Domingo: No disponible",
    };
  }

  const contexto = construirContexto(datos);
  const respuestaRespaldo = construirRespuestaRespaldo(datos);

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
        system: contexto,
        prompt: question.trim(),
        stream: false,
        options: { temperature: 0.1 },
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
      res.json({ response: respuestaRespaldo.trim() });
      return;
    }
    res.json({ response: respuestaRespaldo.trim() });
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { prompt };
