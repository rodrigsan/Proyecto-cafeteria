const especialidades = require("../models/especialidades");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validText(value, maxLength, nullable = true) {
  return (
    value === undefined ||
    (nullable && value === null) ||
    (typeof value === "string" && value.length <= maxLength)
  );
}

async function list(req, res) {
  res.json(await especialidades.findAll());
}

async function get(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  const especialidad = await especialidades.findById(id);
  if (!especialidad) {
    throw httpError(404, "Especialidad no encontrada");
  }
  res.json(especialidad);
}

async function create(req, res) {
  const { nombre, descripcion, imagen, destacado } = req.body;
  if (!validText(nombre, 150) || !validText(descripcion, 1000) || !validText(imagen, 500)) {
    throw httpError(400, "Los textos exceden la longitud permitida");
  }
  const especialidad = await especialidades.create({ nombre, descripcion, imagen, destacado });
  res.status(201).json(especialidad);
}

async function update(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await especialidades.findById(id))) {
    throw httpError(404, "Especialidad no encontrada");
  }

  const fields = {};
  for (const field of ["nombre", "descripcion", "imagen", "destacado"]) {
    const value = req.body[field];
    if (value !== undefined) {
      const max = field === "descripcion" ? 1000 : field === "imagen" ? 500 : 150;
      if (field === "destacado") {
        if (typeof value !== "number" && typeof value !== "string") {
          throw httpError(400, "destacado debe ser 0 o 1");
        }
        fields[field] = Number(value) === 1 ? 1 : 0;
      } else {
        if (!validText(value, max)) {
          throw httpError(400, `${field} debe tener hasta ${max} caracteres o ser null`);
        }
        fields[field] = value;
      }
    }
  }
  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Debe enviar al menos un campo para actualizar");
  }

  res.json(await especialidades.update(id, fields));
}

async function remove(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await especialidades.remove(id))) {
    throw httpError(404, "Especialidad no encontrada");
  }
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };
