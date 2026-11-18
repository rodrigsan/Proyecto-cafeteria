const database = require("../config/database");

async function findOne() {
  const [rows] = await database.query(
    "SELECT id, historia, direccion, telefono, correo, horarios FROM nosotros LIMIT 1"
  );
  return rows[0] || null;
}

async function create({ historia, direccion, telefono, correo, horarios }) {
  const [result] = await database.execute(
    "INSERT INTO nosotros (historia, direccion, telefono, correo, horarios) VALUES (?, ?, ?, ?, ?)",
    [historia ?? null, direccion ?? null, telefono ?? null, correo ?? null, horarios ?? null]
  );
  const [rows] = await database.query(
    "SELECT id, historia, direccion, telefono, correo, horarios FROM nosotros WHERE id = ?",
    [result.insertId]
  );
  return rows[0] || null;
}

async function update(id, fields) {
  const columnNames = {
    historia: "historia",
    direccion: "direccion",
    telefono: "telefono",
    correo: "correo",
    horarios: "horarios",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE nosotros SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id]
  );
  const [rows] = await database.query(
    "SELECT id, historia, direccion, telefono, correo, horarios FROM nosotros WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function remove(id) {
  const [result] = await database.execute("DELETE FROM nosotros WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = { findOne, create, update, remove };
