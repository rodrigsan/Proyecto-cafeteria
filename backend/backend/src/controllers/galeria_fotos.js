const galeriaFotos = require("../models/galeria_fotos");

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
  const nosotrosId = validId(req.params.nosotrosId);
  if (!nosotrosId) {
    throw httpError(400, "El id de nosotros debe ser un entero positivo");
  }
  const fotos = await galeriaFotos.findByNosotrosId(nosotrosId);
  res.json(fotos);
}

async function create(req, res) {
  const { nosotros_id, imagen, descripcion, orden } = req.body;
  if (!validId(nosotros_id)) {
    throw httpError(400, "nosotros_id debe ser un entero positivo");
  }
  if (!validText(imagen, 500) || !validText(descripcion, 200)) {
    throw httpError(400, "Los textos exceden la longitud permitida");
  }
  const foto = await galeriaFotos.create({ nosotros_id, imagen, descripcion, orden });
  res.status(201).json(foto);
}

async function update(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }

  const fields = {};
  for (const field of ["nosotros_id", "imagen", "descripcion", "orden"]) {
    const value = req.body[field];
    if (value !== undefined) {
      if (field === "nosotros_id") {
        if (!validId(value)) {
          throw httpError(400, "nosotros_id debe ser un entero positivo");
        }
      } else if (field === "orden") {
        if (typeof value !== "number" && typeof value !== "string") {
          throw httpError(400, "orden debe ser un número");
        }
      } else {
        const max = field === "descripcion" ? 200 : 500;
        if (!validText(value, max)) {
          throw httpError(400, `${field} debe tener hasta ${max} caracteres o ser null`);
        }
      }
      fields[field] = value;
    }
  }
  if (Object.keys(fields).length === 0) {
    throw httpError(400, "Debe enviar al menos un campo para actualizar");
  }

  const foto = await galeriaFotos.update(id, fields);
  if (!foto) {
    throw httpError(404, "Foto no encontrada");
  }
  res.json(foto);
}

async function remove(req, res) {
  const id = validId(req.params.id);
  if (!id) {
    throw httpError(400, "El id debe ser un entero positivo");
  }
  if (!(await galeriaFotos.remove(id))) {
    throw httpError(404, "Foto no encontrada");
  }
  res.status(204).end();
}

module.exports = { list, create, update, remove };
