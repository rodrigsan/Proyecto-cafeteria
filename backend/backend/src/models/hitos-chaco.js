const database = require("../config/database");

const columns =
  "id, codigo_linea_tiempo, titulo, fecha, ubicacion, bajas, comandantes, descripcion, texto, foto, video, voz";

async function findAll() {
  const [rows] = await database.query(
    `SELECT ${columns} FROM hitos_chaco ORDER BY id`,
  );
  return rows;
}

async function findById(id) {
  const [rows] = await database.execute(
    `SELECT ${columns} FROM hitos_chaco WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
}

async function create(hito) {
  const [result] = await database.execute(
    `INSERT INTO hitos_chaco
      (codigo_linea_tiempo, titulo, fecha, ubicacion, bajas, comandantes,
       descripcion, texto, foto, video, voz)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      hito.codigo_linea_tiempo,
      hito.titulo,
      hito.fecha ?? null,
      hito.ubicacion ?? null,
      hito.bajas ?? null,
      hito.comandantes === undefined ? null : JSON.stringify(hito.comandantes),
      hito.descripcion ?? null,
      hito.texto ?? null,
      hito.foto ?? null,
      hito.video ?? null,
      hito.voz ?? null,
    ],
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const columnNames = {
    codigo_linea_tiempo: "codigo_linea_tiempo",
    titulo: "titulo",
    fecha: "fecha",
    ubicacion: "ubicacion",
    bajas: "bajas",
    comandantes: "comandantes",
    descripcion: "descripcion",
    texto: "texto",
    foto: "foto",
    video: "video",
    voz: "voz",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([field, value]) =>
    field === "comandantes" && value !== null ? JSON.stringify(value) : value,
  );

  await database.execute(
    `UPDATE hitos_chaco SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id],
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await database.execute(
    "DELETE FROM hitos_chaco WHERE id = ?",
    [id],
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
