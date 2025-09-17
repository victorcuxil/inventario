-- Crear base de datos
CREATE DATABASE inventario_pc;

-- Conectarse a la base de datos
\c inventario_pc;

-- Tabla de usuarios (para el login)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla de computadoras
CREATE TABLE computadoras (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    procesador VARCHAR(100),
    ram VARCHAR(20),
    disco VARCHAR(20),
    sistema_operativo VARCHAR(50),
    laboratorio VARCHAR(50)
);

-- Insertar usuario admin de ejemplo (contraseña: 123456)
INSERT INTO usuarios (username, password) VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');