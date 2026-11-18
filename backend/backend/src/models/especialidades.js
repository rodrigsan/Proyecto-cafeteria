const database = require("../config/database");

async function findAll() {
  const [rows] = await database.query(
    "SELECT id, nombre, descripcion, imagen, destacado FROM especialidades WHERE activo = 1 ORDER BY destacado DESC, id"
  );
  return rows;
}

async function findDestacados() {
  const [rows] = await database.query(
    "SELECT id, nombre, descripcion, imagen, destacado FROM especialidades WHERE activo = 1 AND destacado = 1 ORDER BY id"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await database.execute(
    "SELECT id, nombre, descripcion, imagen, destacado FROM especialidades WHERE id = ? AND activo = 1",
    [id]
  );
  return rows[0] || null;
}

async function create({ nombre, descripcion, imagen, destacado }) {
  const [result] = await database.execute(
    "INSERT INTO especialidades (nombre, descripcion, imagen, destacado) VALUES (?, ?, ?, ?)",
    [nombre ?? null, descripcion ?? null, imagen ?? null, destacado ?? 0]
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const columnNames = {
    nombre: "nombre",
    descripcion: "descripcion",
    imagen: "imagen",
    destacado: "destacado",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE especialidades SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await database.execute("DELETE FROM especialidades WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findDestacados, findById, create, update, remove };
