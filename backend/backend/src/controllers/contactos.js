const contactos = require("../models/contactos");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validText(value, maxLength, nullable = true) {
  return (
    value === undefined ||
    (nullable && value === null) ||
    (typeof value === "string" && value.length <= maxLength)
  );
}

function validEmail(value) {
  if (!value || typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function create(req, res) {
  const { nombre, correo, telefono, mensaje } = req.body;
  if (!validText(nombre, 150, false)) {
    throw httpError(400, "nombre es obligatorio y debe tener hasta 150 caracteres");
  }
  if (!validEmail(correo)) {
    throw httpError(400, "correo es obligatorio y debe ser un email válido");
  }
  if (!validText(telefono, 50, true)) {
    throw httpError(400, "teléfono debe tener hasta 50 caracteres");
  }
  if (!validText(mensaje, 2000, false)) {
    throw httpError(400, "mensaje es obligatorio y debe tener hasta 2000 caracteres");
  }

  const contacto = await contactos.create({ nombre, correo, telefono, mensaje });
  res.status(201).json(contacto);
}

async function list(req, res) {
  res.json(await contactos.findAll());
}

async function get(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  const contacto = await contactos.findById(id);
  if (!contacto) {
    throw httpError(404, "Contacto no encontrado");
  }
  res.json(contacto);
}

module.exports = { create, list, get };
