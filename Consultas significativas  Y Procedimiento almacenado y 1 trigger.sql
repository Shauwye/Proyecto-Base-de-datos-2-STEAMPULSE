-- registro estado suscripcion
CREATE OR REPLACE FUNCTION trg_auditoria_suscripcion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado_suscripcion IS DISTINCT FROM NEW.estado_suscripcion THEN
        INSERT INTO Auditoria_Suscripcion(id_suscripcion, estado_anterior, estado_nuevo, usuario_db)
        VALUES (OLD.id_suscripcion, OLD.estado_suscripcion, NEW.estado_suscripcion, current_user);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auditoria_suscripcion
AFTER UPDATE ON Suscripcion
FOR EACH ROW
EXECUTE FUNCTION trg_auditoria_suscripcion();
/*

UPDATE Suscripcion 
SET estado_suscripcion = 'Cancelada' 
WHERE id_suscripcion = 1;

SELECT * FROM Auditoria_Suscripcion 
ORDER BY fecha_cambio DESC;
*/


-- procedmineto alma
-- suspencion

CREATE OR REPLACE PROCEDURE pr_suspender_cuenta(
    p_id_usuario INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Usuario 
    SET estado = 'Suspendido' 
    WHERE id_usuario = p_id_usuario;

    UPDATE Suscripcion 
    SET estado_suscripcion = 'Cancelada' 
    WHERE id_usuario = p_id_usuario 
    AND estado_suscripcion = 'Activa';

    COMMIT;
END;
$$;
-- CALL pr_suspender_cuenta(1);

-- contenido mas pupular
SELECT 
    c.titulo, 
    c.tipo_contenido,
    STRING_AGG(g.nombre_genero, ', ') AS generos,
    COUNT(h.id_historial) AS total_reproducciones,
    ROUND(SUM(h.tiempo_visto_segundos) / 60.0, 2) AS minutos_totales_vistos
FROM Contenido c
JOIN Contenido_Genero cg ON c.id_contenido = cg.id_contenido
JOIN Genero g ON cg.id_genero = g.id_genero
LEFT JOIN Historial_Visualizacion h ON c.id_contenido = h.id_contenido
GROUP BY c.id_contenido, c.titulo, c.tipo_contenido
ORDER BY total_reproducciones DESC, minutos_totales_vistos DESC
LIMIT 10;

-- ingreso mensual
SELECT 
    ps.nombre_plan,
    TO_CHAR(f.fecha_emision, 'YYYY-MM') AS mes_facturacion,
    COUNT(f.id_factura) AS facturas_pagadas,
    SUM(f.total) AS ingresos_totales
FROM Plan_Suscripcion ps
JOIN Suscripcion s ON ps.id_plan = s.id_plan
JOIN Factura f ON s.id_suscripcion = f.id_suscripcion
WHERE f.estado_factura = 'Pagada'
GROUP BY ps.nombre_plan, TO_CHAR(f.fecha_emision, 'YYYY-MM')
ORDER BY mes_facturacion DESC, ingresos_totales DESC;

-- usuarios inactivos

SELECT 
    u.id_usuario,
    u.nombre,
    u.email,
    ps.nombre_plan,
    s.fecha_inicio
FROM Usuario u
JOIN Suscripcion s ON u.id_usuario = s.id_usuario
JOIN Plan_Suscripcion ps ON s.id_plan = ps.id_plan
WHERE s.estado_suscripcion = 'Activa'
AND u.id_usuario NOT IN (
    SELECT DISTINCT id_usuario 
    FROM Historial_Visualizacion 
    WHERE fecha_reproduccion >= CURRENT_DATE - INTERVAL '90 days'
);

--select * from contenido_genero