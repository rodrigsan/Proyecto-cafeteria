const database = require("../config/database");

async function create({ nombre, correo, telefono, mensaje }) {
  const [result] = await database.execute(
    "INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)",
    [nombre ?? null, correo ?? null, telefono ?? null, mensaje ?? null]
  );
  const [rows] = await database.query(
    "SELECT id, nombre, correo, telefono, mensaje, fecha FROM contactos WHERE id = ?",
    [result.insertId]
  );
  return rows[0] || null;
}

async function findAll() {
  const [rows] = await database.query(
    "SELECT id, nombre, correo, telefono, mensaje, fecha FROM contactos ORDER BY fecha DESC"
  );
  return rows;
}

async function findById(id) {
  const [rows] = await database.query(
    "SELECT id, nombre, correo, telefono, mensaje, fecha FROM contactos WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

module.exports = { create, findAll, findById };
