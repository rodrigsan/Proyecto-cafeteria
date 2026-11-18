const servicios = require("../models/servicios");

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
  res.json(await servicios.findAll());
}

async function get(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  const servicio = await servicios.findById(id);
  if (!servicio) {
    throw httpError(404, "Servicio no encontrado");
  }
  res.json(servicio);
}

async function create(req, res) {
  const { nombre, descripcion, icono, imagen } = req.body;
  if (!validText(nombre, 150) || !validText(descripcion, 1000) || !validText(icono, 100) || !validText(imagen, 500)) {
    throw httpError(400, "Los textos exceden la longitud permitida");
  }
  const servicio = await servicios.create({ nombre, descripcion, icono, imagen });
  res.status(201).json(servicio);
}

async function update(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await servicios.findById(id))) {
    throw httpError(404, "Servicio no encontrado");
  }

  const fields = {};
  for (const field of ["nombre", "descripcion", "icono", "imagen"]) {
    const value = req.body[field];
    if (value !== undefined) {
      const max = field === "descripcion" ? 1000 : field === "imagen" ? 500 : 150;
      if (!validText(value, max)) {
        throw httpError(400, `${field} debe tener hasta ${max} caracteres o ser null`);
      }
      fields[field] = value;
    }
  }
  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Debe enviar al menos un campo para actualizar");
  }

  res.json(await servicios.update(id, fields));
}

async function remove(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await servicios.remove(id))) {
    throw httpError(404, "Servicio no encontrado");
  }
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };
