import os
import sys
import unicodedata
import psycopg2
from psycopg2.extras import RealDictCursor
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

POSTGRES_URI = os.getenv("POSTGRES_URI")
MONGODB_URI = os.getenv("MONGODB_URI")

def get_pg_connection():
    try:
        return psycopg2.connect(POSTGRES_URI, cursor_factory=RealDictCursor)
    except psycopg2.Error as e:
        print(f"Error Postgres: {e}")
        return None

def get_mongo_client():
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        return client
    except Exception as e:
        print(f"Error Mongo: {e}")
        return None

def normalizar_texto(texto):
    if not texto: return ""
    return "".join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn').lower().strip()

def ejecutar_escenario_1(pg_conn, mongo_db):
    print("\n" + "="*70)
    print(" ESCENARIO 1: REPORTE UNIFICADO DE RENDIMIENTO POR GÉNERO")
    print("="*70)
    
    # 1. Obtener ingresos en Postgres
    query_pg = """
        SELECT g.nombre_genero, SUM(f.total) as ingresos_totales
        FROM Genero g
        JOIN Contenido_Genero cg ON g.id_genero = cg.id_genero
        JOIN Contenido c ON cg.id_contenido = c.id_contenido
        JOIN Historial_Visualizacion hv ON c.id_contenido = hv.id_contenido
        JOIN Usuario u ON hv.id_usuario = u.id_usuario
        JOIN Suscripcion s ON u.id_usuario = s.id_usuario
        JOIN Factura f ON s.id_suscripcion = f.id_suscripcion
        GROUP BY g.nombre_genero;
    """
    ingresos_pg = {}
    try:
        with pg_conn.cursor() as cursor:
            cursor.execute(query_pg)
            for fila in cursor.fetchall():
                ingresos_pg[fila['nombre_genero']] = float(fila['ingresos_totales'])
    except psycopg2.Error as e:
        print(f"Error Postgres: {e}")
        pg_conn.rollback()

    # 2. Obtener reseñas en Mongo cruzando localmente con su propia colección de contenido
    metricas_mongo = {}
    pipeline = [
        { "$lookup": { "from": "contenido", "localField": "id_contenido", "foreignField": "_id", "as": "info" } },
        { "$unwind": "$info" },
        { "$unwind": "$info.generos" },
        { "$group": {
            "_id": "$info.generos",
            "puntaje_promedio": { "$avg": "$puntaje" },
            "total_resenas": { "$sum": 1 }
        }}
    ]
    try:
        for doc in mongo_db.resenas.aggregate(pipeline):
            metricas_mongo[doc["_id"]] = doc
    except Exception as e:
        print(f"Error Mongo: {e}")

    # 3. Consolidación cruzada (Python) usando claves normalizadas
    claves_normalizadas = set([normalizar_texto(k) for k in ingresos_pg.keys()] + [normalizar_texto(k) for k in metricas_mongo.keys()])
    
    # Diccionarios inversos para mantener la presentación original
    mapa_pg = {normalizar_texto(k): k for k in ingresos_pg.keys()}
    mapa_mg = {normalizar_texto(k): k for k in metricas_mongo.keys()}
    
    print(f"{'Género':<20} | {'Ingresos (PG)':<15} | {'Calificación (Mongo)':<20} | {'Total Reseñas':<15}")
    print("-" * 76)
    
    for gen_norm in sorted(claves_normalizadas):
        nombre_display = mapa_pg.get(gen_norm, mapa_mg.get(gen_norm, gen_norm.capitalize()))
        
        ingreso = ingresos_pg.get(mapa_pg.get(gen_norm), 0.0)
        datos_m = metricas_mongo.get(mapa_mg.get(gen_norm), {})
        
        avg = datos_m.get("puntaje_promedio", 0.0)
        tot = datos_m.get("total_resenas", 0)
        
        if ingreso > 0 or tot > 0:
            print(f"{nombre_display:<20} | ${ingreso:<14,.2f} | {avg:<20.2f} | {tot:<15}")

def ejecutar_escenario_2(pg_conn, mongo_db):
    print("\n" + "="*70)
    print(" ESCENARIO 2: ENRIQUECIMIENTO DEL CATÁLOGO")
    print("="*70)

    # 1. Obtener el catálogo estructurado de Postgres
    query_titulos = "SELECT id_contenido, titulo, tipo_contenido as tipo FROM Contenido ORDER BY id_contenido LIMIT 15;"
    titulos_pg = []
    try:
        with pg_conn.cursor() as cursor:
            cursor.execute(query_titulos)
            titulos_pg = cursor.fetchall()
    except psycopg2.Error:
        pass

    # 2. Obtener los IDs nativos (ObjectIds) de Mongo para trazar el puente de integración
    contenidos_mongo = list(mongo_db.contenido.find({}, {"_id": 1}).sort("_id", 1).limit(15))

    print(f"{'ID':<5} | {'Título (PG)':<30} | {'Tipo':<10} | {'Rating Promedio':<15} | {'Comentarios Activos':<18}")
    print("-" * 88)

    # 3. Enriquecimiento paralelo
    for i, item in enumerate(titulos_pg):
        id_cont = item['id_contenido']
        titulo = item['titulo']
        tipo = item['tipo']
        
        rating = 0.0
        comentarios = 0
        
        # Enlaza secuencialmente el registro relacional con el documento no relacional
        if i < len(contenidos_mongo):
            mongo_id = contenidos_mongo[i]["_id"]
            
            # Consultar actividad social en Atlas/Mongo Local
            pipeline_resenas = [
                { "$match": { "id_contenido": mongo_id } },
                { "$group": { "_id": None, "promedio": { "$avg": "$puntaje" } } }
            ]
            resultado_rating = list(mongo_db.resenas.aggregate(pipeline_resenas))
            if resultado_rating:
                rating = resultado_rating[0]["promedio"]
                
            comentarios = mongo_db.comentarios.count_documents({ "id_contenido": mongo_id })
            
        titulo_corto = titulo if len(titulo) <= 28 else titulo[:25] + "..."
        print(f"{id_cont:<5} | {titulo_corto:<30} | {tipo:<10} | {rating:<15.2f} | {comentarios:<18}")

def ejecutar_escenario_3(pg_conn, mongo_db):
    print("\n" + "="*70)
    print(" ESCENARIO 3: ENGAGEMENT DE COMUNIDAD POR TIPO DE PLAN")
    print("="*70)

    # 1. Usuarios y su plan activo (PostgreSQL)
    query_usuarios = """
        SELECT u.id_usuario, u.nombre, ps.nombre_plan
        FROM Usuario u
        JOIN Suscripcion s ON u.id_usuario = s.id_usuario
        JOIN Plan_Suscripcion ps ON s.id_plan = ps.id_plan
        WHERE s.estado_suscripcion = 'Activa';
    """
    
    stats_por_plan = {
        "Básico": {"usuarios": 0, "total_interacciones": 0},
        "Estándar": {"usuarios": 0, "total_interacciones": 0},
        "Premium": {"usuarios": 0, "total_interacciones": 0}
    }
    
    try:
        with pg_conn.cursor() as cursor:
            cursor.execute(query_usuarios)
            usuarios_pg = cursor.fetchall()
    except psycopg2.Error as e:
        print(f"Error Postgres en Escenario 3: {e}")
        return

    usuarios_mongo = []
    try:
        # Se ordenan por _id para mantener la misma secuencia (1 a 50) de Postgres
        usuarios_mongo = list(mongo_db.usuarios.find({}, {"_id": 1}).sort("_id", 1))
    except Exception:
        pass

    # 3. Contar interacciones puras en Mongo (Agrupadas por el ObjectId)
    interacciones_mongo = {}
    try:
        for resena in mongo_db.resenas.find({}, {"id_usuario": 1}):
            uid = str(resena.get("id_usuario", ""))
            interacciones_mongo[uid] = interacciones_mongo.get(uid, 0) + 1
        
        for coment in mongo_db.comentarios.find({}, {"id_usuario": 1}):
            uid = str(coment.get("id_usuario", ""))
            interacciones_mongo[uid] = interacciones_mongo.get(uid, 0) + 1
    except Exception:
        pass

    # 4. Consolidación cruzada en Memoria (Traduciendo el ID)
    for user in usuarios_pg:
        id_pg = user['id_usuario'] # Ej: 1, 2, 3...
        plan = user['nombre_plan']
        
        interacciones = 0
        indice_array = id_pg - 1 # El usuario 1 de PG está en la posición 0 de Mongo
        
        # Si el usuario existe en el array de Mongo, usamos su verdadero ObjectId para buscar
        if 0 <= indice_array < len(usuarios_mongo):
            mongo_uid_str = str(usuarios_mongo[indice_array]["_id"])
            interacciones = interacciones_mongo.get(mongo_uid_str, 0)

        if plan not in stats_por_plan:
            stats_por_plan[plan] = {"usuarios": 0, "total_interacciones": 0}
            
        stats_por_plan[plan]["usuarios"] += 1
        stats_por_plan[plan]["total_interacciones"] += interacciones

    # 5. Imprimir resultados
    print(f"{'Plan de Suscripción':<20} | {'Usuarios Activos':<18} | {'Total Interacciones (Mongo)':<30}")
    print("-" * 72)
    
    for plan, datos in stats_por_plan.items():
        if datos["usuarios"] > 0:
            usuarios = datos["usuarios"]
            interacciones = datos["total_interacciones"]
            
            promedio = interacciones / usuarios if usuarios > 0 else 0
            str_interacciones = f"{interacciones}  (Promedio: {promedio:.1f} x usuario)"
            
            print(f"{plan:<20} | {usuarios:<18} | {str_interacciones:<30}")       

def main():
    print("Iniciando Script...")
    pg_conn = get_pg_connection()
    mongo_client = get_mongo_client()
    
    if not pg_conn or not mongo_client:
        sys.exit(1)
        
    try:
        mongo_db = mongo_client.steampulse
        ejecutar_escenario_1(pg_conn, mongo_db)
        ejecutar_escenario_2(pg_conn, mongo_db)
        ejecutar_escenario_3(pg_conn, mongo_db)

    finally:
        if pg_conn: pg_conn.close()
        if mongo_client: mongo_client.close()
        print("\nDesconectado de las bases de datos locales.")

if __name__ == "__main__":
    main()