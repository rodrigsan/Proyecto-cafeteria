const database = require("../config/database");

async function findActive() {
  const [rows] = await database.query(
    "SELECT id, titulo_principal, subtitulo, texto_boton, url_video_pexels FROM inicio WHERE activo = 1 LIMIT 1"
  );
  return rows[0] || null;
}

module.exports = { findActive };
