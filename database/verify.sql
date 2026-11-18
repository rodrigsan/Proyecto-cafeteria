SHOW TABLES;
SELECT 'inicio' AS tabla, COUNT(*) AS registros FROM inicio
UNION ALL SELECT 'servicios', COUNT(*) FROM servicios
UNION ALL SELECT 'especialidades', COUNT(*) FROM especialidades
UNION ALL SELECT 'nosotros', COUNT(*) FROM nosotros
UNION ALL SELECT 'galeria_fotos', COUNT(*) FROM galeria_fotos
UNION ALL SELECT 'precios', COUNT(*) FROM precios
UNION ALL SELECT 'contactos', COUNT(*) FROM contactos;
