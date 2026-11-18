const database = require("../config/database");

async function findByNosotrosId(nosotrosId) {
  const [rows] = await database.query(
    "SELECT id, nosotros_id, imagen, descripcion, orden FROM galeria_fotos WHERE nosotros_id = ? ORDER BY orden, id",
    [nosotrosId]
  );
  return rows;
}

async function create({ nosotros_id, imagen, descripcion, orden }) {
  const [result] = await database.execute(
    "INSERT INTO galeria_fotos (nosotros_id, imagen, descripcion, orden) VALUES (?, ?, ?, ?)",
    [nosotros_id ?? null, imagen ?? null, descripcion ?? null, orden ?? 0]
  );
  const [rows] = await database.query(
    "SELECT id, nosotros_id, imagen, descripcion, orden FROM galeria_fotos WHERE id = ?",
    [result.insertId]
  );
  return rows[0] || null;
}

async function update(id, fields) {
  const columnNames = {
    nosotros_id: "nosotros_id",
    imagen: "imagen",
    descripcion: "descripcion",
    orden: "orden",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE galeria_fotos SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id]
  );
  const [rows] = await database.query(
    "SELECT id, nosotros_id, imagen, descripcion, orden FROM galeria_fotos WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function remove(id) {
  const [result] = await database.execute("DELETE FROM galeria_fotos WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = { findByNosotrosId, create, update, remove };
