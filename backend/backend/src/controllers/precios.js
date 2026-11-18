const precios = require("../models/precios");

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

function validPrice(value) {
  if (typeof value !== "number" && typeof value !== "string") {
    return false;
  }
  const priceText = String(value).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(priceText)) {
    return false;
  }
  const price = Number(priceText);
  return Number.isFinite(price) && price >= 0 && price <= 99999999.99;
}

async function list(req, res) {
  res.json(await precios.findAll());
}

async function get(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  const precio = await precios.findById(id);
  if (!precio) {
    throw httpError(404, "Precio no encontrado");
  }
  res.json(precio);
}

async function create(req, res) {
  const { categoria, nombre, descripcion, precio } = req.body;
  if (!validText(categoria, 100) || !validText(nombre, 150) || !validText(descripcion, 1000) || !validPrice(precio)) {
    throw httpError(400, "Datos inválidos: textos muy largos o precio fuera de rango");
  }
  const nuevoPrecio = await precios.create({ categoria, nombre, descripcion, precio: Number(precio) });
  res.status(201).json(nuevoPrecio);
}

async function update(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await precios.findById(id))) {
    throw httpError(404, "Precio no encontrado");
  }

  const fields = {};
  for (const field of ["categoria", "nombre", "descripcion", "precio"]) {
    const value = req.body[field];
    if (value !== undefined) {
      if (field === "precio") {
        if (!validPrice(value)) {
          throw httpError(400, "precio debe estar entre 0 y 99999999.99 con hasta 2 decimales");
        }
        fields.precio = Number(value);
      } else {
        const max = field === "descripcion" ? 1000 : field === "categoria" ? 100 : 150;
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

  res.json(await precios.update(id, fields));
}

async function remove(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await precios.remove(id))) {
    throw httpError(404, "Precio no encontrado");
  }
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };
