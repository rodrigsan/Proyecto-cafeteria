-- ============================================================================
-- Base de datos para CoffeeHouse (Cochabamba, Bolivia)
-- Proyecto Full-Stack: Angular + Node.js + MySQL + Ollama
-- ============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS cafeteria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafeteria;

-- ----------------------------------------------------------------------------
-- Tabla: inicio (contenido de la portada / hero)
-- ----------------------------------------------------------------------------
CREATE TABLE inicio (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo_principal VARCHAR(200) NOT NULL,
  subtitulo VARCHAR(300) NOT NULL,
  texto_boton VARCHAR(100) NOT NULL,
  url_video_pexels VARCHAR(500) NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Tabla: servicios (servicios que ofrece la cafetería)
-- ----------------------------------------------------------------------------
CREATE TABLE servicios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  icono VARCHAR(100) NOT NULL,
  imagen VARCHAR(500) NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Tabla: especialidades (productos/cafés estrella de la casa)
-- ----------------------------------------------------------------------------
CREATE TABLE especialidades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  imagen VARCHAR(500) NOT NULL,
  destacado TINYINT(1) DEFAULT 0,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Tabla: nosotros (historia, dirección, teléfono, horarios, correo)
-- ----------------------------------------------------------------------------
CREATE TABLE nosotros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  historia TEXT NOT NULL,
  direccion VARCHAR(300) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  correo VARCHAR(150),
  horarios JSON NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Tabla: galeria_fotos (fotos de la tienda, 1:N con nosotros)
-- ----------------------------------------------------------------------------
CREATE TABLE galeria_fotos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nosotros_id INT NOT NULL,
  imagen VARCHAR(500) NOT NULL,
  descripcion VARCHAR(200),
  orden INT DEFAULT 0,
  FOREIGN KEY (nosotros_id) REFERENCES nosotros(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Tabla: precios (catálogo de bebidas y repostería en Bs.)
-- ----------------------------------------------------------------------------
CREATE TABLE precios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  categoria VARCHAR(100) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  activo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Tabla: contactos (mensajes del formulario de contacto)
-- ----------------------------------------------------------------------------
CREATE TABLE contactos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  correo VARCHAR(150) NOT NULL,
  telefono VARCHAR(50),
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DATOS DE PRUEBA REALISTAS (CoffeeHouse, Cochabamba, Bs.)
-- ============================================================================

-- Inicio (portada con video de Pexels)
INSERT INTO inicio (titulo_principal, subtitulo, texto_boton, url_video_pexels, activo) VALUES
('El Mejor Café de la Ciudad', 'Calidad, sabor y experiencia en cada taza', 'EXPLORAR MENÚ',
 'https://videos.pexels.com/video-files/855263/855263-hd_1920_1080_25fps.mp4', 1);

-- Servicios
INSERT INTO servicios (nombre, descripcion, icono, imagen, activo) VALUES
('Café de especialidad', 'Cafés de grano seleccionado, preparados con técnicas de barista para resaltar sus notas únicas.', 'coffee-bean', 'https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg', 1),
('Desayunos y brunch', 'Opciones completas para comenzar el día con energía: tostadas, avena, huevos y jugos naturales.', 'breakfast', 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg', 1),
('Repostería artesanal', 'Dulces, tortas y galletas hechas en casa con ingredientes frescos y de temporada.', 'cake', 'https://images.pexels.com/photos/416628/pexels-photo-416628.jpeg', 1),
('Espacio de trabajo remoto', 'Wi-Fi de alta velocidad, enchufes y ambiente tranquilo ideal para estudiar o trabajar desde tu laptop.', 'wifi', 'https://images.pexels.com/photos/374616/pexels-photo-374616.jpeg', 1),
('Eventos privados', 'Espacio para reuniones pequeñas, cumpleaños y encuentros de trabajo con atención personalizada.', 'calendar', 'https://images.pexels.com/photos/3184327/pexels-photo-3184327.jpeg', 1);

-- Especialidades (cafés estrella de la casa)
INSERT INTO especialidades (nombre, descripcion, imagen, destacado, activo) VALUES
('Café de altura Cochabamba', 'Cultivado en los valles de Cochabamba, con notas cítricas y cuerpo medio. Nuestro café insignia.', 'https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg', 1, 1),
('Espresso doble', 'Extracción intensa y equilibrada, crema dorada y sabor persistente.', 'https://images.pexels.com/photos/373764/pexels-photo-373764.jpeg', 1, 1),
('Cappuccino italiano', 'Espresso con leche vaporizada y espuma cremosa, espolvoreado con cacao.', 'https://images.pexels.com/photos/371644/pexels-photo-371644.jpeg', 0, 1),
('Latte vainilla', 'Suave combinación de espresso, leche caliente y jarabe de vainilla natural.', 'https://images.pexels.com/photos/734954/pexels-photo-734954.jpeg', 0, 1),
('Tiramisú clásico', 'Postre italiano con capas de café, queso mascarpone y cacao en polvo.', 'https://images.pexels.com/photos/374624/pexels-photo-374624.jpeg', 1, 1);

-- Nosotros (CoffeeHouse, Cochabamba, Bolivia)
INSERT INTO nosotros (historia, direccion, telefono, correo, horarios) VALUES
('Fundada en 2022 en el corazón de Cochabamba, CoffeeHouse nace de la pasión por el café de especialidad y el deseo de crear un espacio donde la gente se encuentre, trabaje y disfrute. Seleccionamos granos de altura de los valles cochabambinos y los tostamos artesanalmente para ofrecer una experiencia única en cada taza. Bienvenido a tu segunda casa.',
 'Av. Heroínas esq. San Martín, zona Centro, Cochabamba, Bolivia',
 '+591 4 4256789',
 'hola@coffeehouse.bo',
 '{"lunesAViernes": "07:30–20:00", "sabado": "08:00–19:00", "domingo": "09:00–18:00"}');

-- Galería de fotos de la tienda
INSERT INTO galeria_fotos (nosotros_id, imagen, descripcion, orden) VALUES
(1, 'https://images.pexels.com/photos/374616/pexels-photo-374616.jpeg', 'Interior de la cafetería, zona de trabajo y mesas', 1),
(1, 'https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg', 'Barista preparando café de especialidad', 2),
(1, 'https://images.pexels.com/photos/416628/pexels-photo-416628.jpeg', 'Vitrina de repostería artesanal', 3),
(1, 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg', 'Desayuno completo en mesa iluminada', 4);

-- Precios (catálogo en Bs.)
INSERT INTO precios (categoria, nombre, descripcion, precio, activo) VALUES
-- Bebidas Calientes
('Bebidas Calientes', 'Espresso', 'Café intenso y concentrado', 12.00, 1),
('Bebidas Calientes', 'Americano', 'Espresso con agua caliente', 14.00, 1),
('Bebidas Calientes', 'Cappuccino', 'Espresso con leche vaporizada y espuma', 18.00, 1),
('Bebidas Calientes', 'Latte', 'Espresso con leche caliente y poca espuma', 20.00, 1),
('Bebidas Calientes', 'Mocaccino', 'Espresso con chocolate y leche vaporizada', 22.00, 1),
-- Bebidas Frías
('Bebidas Frías', 'Café frappé', 'Café helado batido con hielo y leche', 20.00, 1),
('Bebidas Frías', 'Cold brew', 'Café de infusión en frío por 18 horas', 18.00, 1),
('Bebidas Frías', 'Té helado', 'Té natural con hielo y limón', 12.00, 1),
('Bebidas Frías', 'Latte helado vainilla', 'Espresso frío, leche y jarabe de vainilla', 22.00, 1),
-- Especialidades
('Especialidades', 'Café de altura Cochabamba', 'Grano de altura de los valles cochabambinos', 16.00, 1),
('Especialidades', 'Affogato', 'Espresso sobre bola de helado de vainilla', 24.00, 1),
-- Repostería
('Repostería', 'Tiramisú clásico', 'Capas de café, mascarpone y cacao', 28.00, 1),
('Repostería', 'Cheesecake de frutos rojos', 'Base de galleta con cobertura de frutos rojos', 26.00, 1),
('Repostería', 'Brownie de chocolate', 'Brownie jugoso con nueces', 20.00, 1);

-- Mensaje de contacto de ejemplo
INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES
('María Pérez', 'maria.perez@email.com', '+591 4 4256789', 'Hola, quisiera saber si tienen opciones sin gluten y si aceptan reservas para grupos. Gracias.');
