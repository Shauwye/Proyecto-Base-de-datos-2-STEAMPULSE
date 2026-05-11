
-- SCRIPT DE CREACIÓN (DDL) - STEAMPULSE

CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Activo', 'Inactivo', 'Suspendido'))
);

CREATE TABLE Plan_Suscripcion (
    id_plan SERIAL PRIMARY KEY,
    nombre_plan VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    max_resolucion VARCHAR(20) NOT NULL,
    max_pantallas INT NOT NULL CHECK (max_pantallas > 0)
);

CREATE TABLE Suscripcion (
    id_suscripcion SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_plan INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado_suscripcion VARCHAR(20) NOT NULL CHECK (estado_suscripcion IN ('Activa', 'Cancelada', 'Vencida')),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_plan) REFERENCES Plan_Suscripcion(id_plan) ON DELETE RESTRICT
);

CREATE TABLE Factura (
    id_factura SERIAL PRIMARY KEY,
    id_suscripcion INT NOT NULL,
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    impuestos DECIMAL(10,2) NOT NULL CHECK (impuestos >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    estado_factura VARCHAR(20) NOT NULL CHECK (estado_factura IN ('Pagada', 'Pendiente', 'Cancelada')),
    FOREIGN KEY (id_suscripcion) REFERENCES Suscripcion(id_suscripcion) ON DELETE CASCADE
);

CREATE TABLE Pago (
    id_pago SERIAL PRIMARY KEY,
    id_factura INT NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL CHECK (metodo_pago IN ('Tarjeta de Credito', 'PayPal', 'Transferencia', 'Cripto')),
    fecha_transaccion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2) NOT NULL CHECK (monto >= 0),
    estado_pago VARCHAR(20) NOT NULL CHECK (estado_pago IN ('Completado', 'Rechazado', 'Reembolsado')),
    FOREIGN KEY (id_factura) REFERENCES Factura(id_factura) ON DELETE CASCADE
);



CREATE TABLE Contenido (
    id_contenido SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    clasificacion_edad VARCHAR(10) NOT NULL,
    anio_lanzamiento INT NOT NULL CHECK (anio_lanzamiento >= 1888),
    tipo_contenido VARCHAR(20) NOT NULL CHECK (tipo_contenido IN ('Pelicula', 'Serie'))
);

CREATE TABLE Pelicula (
    id_contenido INT PRIMARY KEY,
    duracion_minutos INT NOT NULL CHECK (duracion_minutos > 0),
    sinopsis TEXT,
    FOREIGN KEY (id_contenido) REFERENCES Contenido(id_contenido) ON DELETE CASCADE
);

CREATE TABLE Serie (
    id_contenido INT PRIMARY KEY,
    cantidad_temporadas INT NOT NULL CHECK (cantidad_temporadas > 0),
    estado_emision VARCHAR(30) NOT NULL CHECK (estado_emision IN ('En Emision', 'Finalizada', 'Cancelada')),
    FOREIGN KEY (id_contenido) REFERENCES Contenido(id_contenido) ON DELETE CASCADE
);

CREATE TABLE Episodio (
    id_episodio SERIAL PRIMARY KEY,
    id_serie INT NOT NULL,
    temporada INT NOT NULL CHECK (temporada > 0),
    numero_episodio INT NOT NULL CHECK (numero_episodio > 0),
    titulo_episodio VARCHAR(150) NOT NULL,
    duracion_minutos INT NOT NULL CHECK (duracion_minutos > 0),
    FOREIGN KEY (id_serie) REFERENCES Serie(id_contenido) ON DELETE CASCADE
);


CREATE TABLE Genero (
    id_genero SERIAL PRIMARY KEY,
    nombre_genero VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Contenido_Genero (
    id_contenido INT NOT NULL,
    id_genero INT NOT NULL,
    PRIMARY KEY (id_contenido, id_genero),
    FOREIGN KEY (id_contenido) REFERENCES Contenido(id_contenido) ON DELETE CASCADE,
    FOREIGN KEY (id_genero) REFERENCES Genero(id_genero) ON DELETE CASCADE
);

CREATE TABLE Historial_Visualizacion (
    id_historial SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_contenido INT NOT NULL,
    fecha_reproduccion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tiempo_visto_segundos INT NOT NULL CHECK (tiempo_visto_segundos >= 0),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_contenido) REFERENCES Contenido(id_contenido) ON DELETE CASCADE
);


-- ÍNDICES

CREATE INDEX idx_usuario_email ON Usuario(email);
CREATE INDEX idx_suscripcion_usuario ON Suscripcion(id_usuario);
CREATE INDEX idx_factura_suscripcion ON Factura(id_suscripcion);
CREATE INDEX idx_episodio_serie ON Episodio(id_serie);
CREATE INDEX idx_historial_usuario ON Historial_Visualizacion(id_usuario);