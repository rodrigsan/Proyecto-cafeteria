const hitos = require("../models/hitos");

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validText(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.length <= 100)
  );
}

function normalizeDate(value) {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,6}))?)?)?$/.exec(
    value,
  );
  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText] =
    match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = hourText === undefined ? 0 : Number(hourText);
  const minute = minuteText === undefined ? 0 : Number(minuteText);
  const second = secondText === undefined ? 0 : Number(secondText);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];

  if (
    year < 1000 ||
    !daysInMonth ||
    day < 1 ||
    day > daysInMonth ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return null;
  }

  return hourText === undefined
    ? `${value} 00:00:00`
    : value.replace("T", " ");
}

async function getAll(req, res) {
  res.json(await hitos.getAll());
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
  const { fecha, titulo, descripcion, imagen, video, voz } = req.body;
  const normalizedDate = normalizeDate(fecha);
  if (normalizedDate === null && fecha !== undefined && fecha !== null) {
    throw httpError(
      400,
      "fecha debe ser una fecha válida en formato YYYY-MM-DD o YYYY-MM-DD HH:mm:ss",
    );
  }
  if (![titulo, descripcion, imagen, video, voz].every(validText)) {
    throw httpError(400, "Los textos deben tener hasta 100 caracteres o ser null");
  }

  const hito = await hitos.create({
    fecha: normalizedDate,
    titulo,
    descripcion,
    imagen,
    video,
    voz,
  });
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
  if (req.body.fecha !== undefined) {
    const normalizedDate = normalizeDate(req.body.fecha);
    if (normalizedDate === null && req.body.fecha !== null) {
      throw httpError(
        400,
        "fecha debe ser una fecha válida en formato YYYY-MM-DD o YYYY-MM-DD HH:mm:ss",
      );
    }
    fields.fecha = normalizedDate;
  }
  for (const field of ["titulo", "descripcion", "imagen", "video", "voz"]) {
    const value = req.body[field];
    if (value !== undefined) {
      if (!validText(value)) {
        throw httpError(400, `${field} debe tener hasta 100 caracteres o ser null`);
      }
      fields[field] = value;
    }
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

module.exports = { getAll, list: getAll, get, create, update, remove };
