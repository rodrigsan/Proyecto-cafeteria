const database = require("../config/database");

async function findAll() {
  const [rows] = await database.query(
    "SELECT id, categoria, nombre, descripcion, precio FROM precios WHERE activo = 1 ORDER BY categoria, id"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await database.execute(
    "SELECT id, categoria, nombre, descripcion, precio FROM precios WHERE id = ? AND activo = 1",
    [id]
  );
  return rows[0] || null;
}

async function create({ categoria, nombre, descripcion, precio }) {
  const [result] = await database.execute(
    "INSERT INTO precios (categoria, nombre, descripcion, precio) VALUES (?, ?, ?, ?)",
    [categoria ?? null, nombre ?? null, descripcion ?? null, precio]
  );
  return findById(result.insertId);
}

async function update(id, fields) {
  const columnNames = {
    categoria: "categoria",
    nombre: "nombre",
    descripcion: "descripcion",
    precio: "precio",
  };
  const entries = Object.entries(fields);
  const assignments = entries.map(([field]) => `${columnNames[field]} = ?`);
  const values = entries.map(([, value]) => value);

  await database.execute(
    `UPDATE precios SET ${assignments.join(", ")} WHERE id = ?`,
    [...values, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await database.execute("DELETE FROM precios WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };
