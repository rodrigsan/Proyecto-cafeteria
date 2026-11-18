const inicio = require("../models/inicio");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function list(req, res) {
  const registro = await inicio.findActive();
  if (!registro) {
    throw httpError(404, "No se encontró contenido de inicio activo");
  }
  res.json(registro);
}

module.exports = { list };
