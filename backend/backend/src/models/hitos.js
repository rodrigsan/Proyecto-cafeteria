const database = require("../config/database");
const columns = "id, fecha, titulo, descripcion, imagen, video, voz";

async function getAll() {
  const [rows] = await database.query(
    "SELECT * FROM hitos ORDER BY id",
  );
  return rows;
}

const findAll = getAll;

async function findById(id) {
  const [rows] = await database.execute(
    `SELECT ${columns} FROM hitos WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
}

async function create({ fecha, titulo, descripcion, imagen, video, voz }) {
  const [result] = await database.execute(
    "INSERT INTO hitos (fecha, titulo, descripcion, imagen, video, voz) VALUES (?, ?, ?, ?, ?, ?)",
    [
      fecha ?? null,
      titulo ?? null,
      descripcion ?? null,
      imagen ?? null,
      video ?? null,
      voz ?? null,
    ],
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const columnNames = {
    fecha: "fecha",
    titulo: "titulo",
    descripcion: "descripcion",
    imagen: "imagen",
    video: "video",
    voz: "voz",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE hitos SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id],
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await database.execute("DELETE FROM hitos WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}

module.exports = { getAll, findAll, findById, create, update, remove };
