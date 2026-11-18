const nosotros = require("../models/nosotros");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function get(req, res) {
  const registro = await nosotros.findOne();
  if (!registro) {
    throw httpError(404, "No se encontró información de nosotros");
  }
  res.json(registro);
}

async function create(req, res) {
  const { historia, direccion, telefono, correo, horarios } = req.body;
  if (!historia || !direccion || !telefono || !horarios) {
    throw httpError(400, "historia, direccion, telefono y horarios son obligatorios");
  }
  const registro = await nosotros.create({ historia, direccion, telefono, correo, horarios });
  res.status(201).json(registro);
}

async function update(req, res) {
  const registro = await nosotros.findOne();
  if (!registro) {
    throw httpError(404, "No se encontró información de nosotros");
  }

  const fields = {};
  for (const field of ["historia", "direccion", "telefono", "correo", "horarios"]) {
    const value = req.body[field];
    if (value !== undefined) {
      fields[field] = value;
    }
  }
  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Debe enviar al menos un campo para actualizar");
  }

  res.json(await nosotros.update(registro.id, fields));
}

async function remove(req, res) {
  const registro = await nosotros.findOne();
  if (!registro) {
    throw httpError(404, "No se encontró información de nosotros");
  }
  if (!(await nosotros.remove(registro.id))) {
    throw httpError(404, "No se encontró información de nosotros");
  }
  res.status(204).end();
}

module.exports = { get, create, update, remove };
