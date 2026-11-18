const hitos = require("../models/hitos-chaco");

const textLimits = {
  codigo_linea_tiempo: 100,
  titulo: 255,
  fecha: 100,
  ubicacion: 255,
  bajas: 65535,
  descripcion: 65535,
  texto: 4294967295,
  foto: 255,
  video: 255,
  voz: 255,
};

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validText(value, maxLength) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.length <= maxLength)
  );
}

function validCommanders(value) {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) &&
      value.every(
        (commander) =>
          typeof commander === "string" && commander.length <= 255,
      ))
  );
}

async function list(req, res) {
  res.json(await hitos.findAll());
}

async function get(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  const hito = await hitos.findById(id);
  if (!hito) {
    throw httpError(404, "Hito no encontrado");
  }
  res.json(hito);
}

async function create(req, res) {
  const { codigo_linea_tiempo: codigo, titulo, comandantes } = req.body;
  if (
    typeof codigo !== "string" ||
    codigo.trim().length === 0 ||
    typeof titulo !== "string" ||
    titulo.trim().length === 0
  ) {
    throw httpError(400, "codigo_linea_tiempo y titulo son obligatorios");
  }

  for (const [field, maxLength] of Object.entries(textLimits)) {
    if (!validText(req.body[field], maxLength)) {
      throw httpError(400, `${field} debe ser texto de hasta ${maxLength} caracteres o null`);
    }
  }
  if (!validCommanders(comandantes)) {
    throw httpError(400, "comandantes debe ser un arreglo de textos o null");
  }

  const hito = await hitos.create(req.body);
  res.status(201).json(hito);
}

async function update(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await hitos.findById(id))) {
    throw httpError(404, "Hito no encontrado");
  }

  const fields = {};
  for (const [field, maxLength] of Object.entries(textLimits)) {
    if (req.body[field] !== undefined) {
      if (!validText(req.body[field], maxLength)) {
        throw httpError(
          400,
          `${field} debe ser texto de hasta ${maxLength} caracteres o null`,
        );
      }
      if (
        (field === "codigo_linea_tiempo" || field === "titulo") &&
        (typeof req.body[field] !== "string" ||
          req.body[field].trim().length === 0)
      ) {
        throw httpError(400, `${field} no puede estar vacío`);
      }
      fields[field] = req.body[field];
    }
  }
  if (req.body.comandantes !== undefined) {
    if (!validCommanders(req.body.comandantes)) {
      throw httpError(400, "comandantes debe ser un arreglo de textos o null");
    }
    fields.comandantes = req.body.comandantes;
  }
  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Debe enviar al menos un campo para actualizar");
  }

  res.json(await hitos.update(id, fields));
}

async function remove(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await hitos.remove(id))) {
    throw httpError(404, "Hito no encontrado");
  }
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };
