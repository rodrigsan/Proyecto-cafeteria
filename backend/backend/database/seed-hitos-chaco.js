const database = require("../src/config/database");
const hitos = require("./hitos.json");

const createTableSql = `
  CREATE TABLE IF NOT EXISTS hitos_chaco (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo_linea_tiempo VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    fecha VARCHAR(100) DEFAULT NULL,
    ubicacion VARCHAR(255) DEFAULT NULL,
    bajas TEXT DEFAULT NULL,
    comandantes JSON DEFAULT NULL,
    descripcion TEXT DEFAULT NULL,
    texto LONGTEXT DEFAULT NULL,
    foto VARCHAR(255) DEFAULT NULL,
    video VARCHAR(255) DEFAULT NULL,
    voz VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_hitos_chaco_codigo_linea_tiempo (codigo_linea_tiempo)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

async function seedHitosChaco() {
  const connection = await database.getConnection();
  let transactionStarted = false;
  try {
    await connection.query(createTableSql);
    await connection.beginTransaction();
    transactionStarted = true;

    const sql = `
      INSERT INTO hitos_chaco
        (id, codigo_linea_tiempo, titulo, fecha, ubicacion, bajas, comandantes,
         descripcion, texto, foto, video, voz)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        codigo_linea_tiempo = VALUES(codigo_linea_tiempo),
        titulo = VALUES(titulo),
        fecha = VALUES(fecha),
        ubicacion = VALUES(ubicacion),
        bajas = VALUES(bajas),
        comandantes = VALUES(comandantes),
        descripcion = VALUES(descripcion),
        texto = VALUES(texto),
        foto = VALUES(foto),
        video = VALUES(video),
        voz = VALUES(voz)
    `;

    for (const hito of hitos) {
      await connection.execute(sql, [
        hito.id,
        hito.codigo_linea_tiempo,
        hito.titulo,
        hito.fecha,
        hito.ubicacion,
        hito.bajas,
        JSON.stringify(hito.comandantes),
        hito.descripcion,
        hito.texto,
        hito.foto,
        hito.video,
        hito.voz,
      ]);
    }

    await connection.commit();
    transactionStarted = false;
    return hitos.length;
  } catch (error) {
    if (transactionStarted) {
      await connection.rollback();
    }
    throw error;
  } finally {
    connection.release();
  }
}

if (require.main === module) {
  seedHitosChaco()
    .then(async (count) => {
      console.log(`${count} hitos de Chaco insertados/actualizados.`);
      await database.end();
    })
    .catch(async (error) => {
      console.error("No se pudieron cargar los hitos de Chaco:", error.message);
      await database.end();
      process.exitCode = 1;
    });
}

module.exports = seedHitosChaco;
