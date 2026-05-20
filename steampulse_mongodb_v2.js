// =============================================================
// STEAMPULSE - Script MongoDB Completo
// Pegar en mongosh o ejecutar con:
//   mongosh steampulse steampulse_mongodb.js
// =============================================================

use('steampulse');

// Limpiar colecciones previas
var cols = ['planes','usuarios','contenido','suscripciones','historial']; cols.forEach(c => { try { db[c].drop() } catch(e) {} })
print("\n=== STEAMPULSE: Creando colecciones y datos de prueba ===\n")

// =============================================================
// 1. COLECCIÓN: planes  (5 documentos)
// =============================================================
const pEst = new ObjectId(), pBas = new ObjectId(), pStd = new ObjectId(),
      pPre = new ObjectId(), pFam = new ObjectId()

db.planes.insertMany([
  { _id: pEst, nombre_plan: "Estudiante", precio: 5.99,  max_resolucion: "720p",  max_pantallas: 1 },
  { _id: pBas, nombre_plan: "Basico",     precio: 7.99,  max_resolucion: "720p",  max_pantallas: 1 },
  { _id: pStd, nombre_plan: "Estandar",   precio: 11.99, max_resolucion: "1080p", max_pantallas: 2 },
  { _id: pPre, nombre_plan: "Premium",    precio: 15.99, max_resolucion: "4K",    max_pantallas: 4 },
  { _id: pFam, nombre_plan: "Familiar",   precio: 19.99, max_resolucion: "4K",    max_pantallas: 6 },
])
print("✓ planes:       " + db.planes.countDocuments() + " documentos")

// =============================================================
// 2. COLECCIÓN: contenido  (60 documentos: 40 peliculas + 20 series)
// =============================================================
const cIds = Array.from({length: 60}, () => new ObjectId())

const peliculas = [
  { _id: cIds[0],  titulo: "El Ultimo Horizonte",        tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG-13", generos: ["Accion","Aventura"],           detalles: { duracion_minutos: 128, sinopsis: "Un astronauta descubre que el universo esta vivo." } },
  { _id: cIds[1],  titulo: "Sombras del Pasado",          tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "R",     generos: ["Thriller","Drama"],            detalles: { duracion_minutos: 112, sinopsis: "Un detective persigue a un asesino que copia crimenes historicos." } },
  { _id: cIds[2],  titulo: "Noche de Neon",               tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "PG-13", generos: ["Accion","Ciencia Ficcion"],    detalles: { duracion_minutos: 102, sinopsis: "En una ciudad futurista, un hacker descubre una conspiracion global." } },
  { _id: cIds[3],  titulo: "La Ultima Frontera",          tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG",    generos: ["Aventura","Familia"],          detalles: { duracion_minutos: 95,  sinopsis: "Una familia encuentra un portal a mundos desconocidos." } },
  { _id: cIds[4],  titulo: "Codigo Rojo",                 tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "R",     generos: ["Accion","Suspenso"],          detalles: { duracion_minutos: 118, sinopsis: "Un agente encubierto debe desactivar una bomba biologica." } },
  { _id: cIds[5],  titulo: "El Jardin de los Sueños",     tipo_contenido: "Pelicula", anio_lanzamiento: 2020, clasificacion_edad: "PG",    generos: ["Drama","Romance"],            detalles: { duracion_minutos: 108, sinopsis: "Dos artistas se enamoran en una ciudad europea." } },
  { _id: cIds[6],  titulo: "Tormenta de Acero",           tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "R",     generos: ["Accion","Belico"],            detalles: { duracion_minutos: 135, sinopsis: "Soldados luchan por sobrevivir en una guerra olvidada." } },
  { _id: cIds[7],  titulo: "Mas alla del Velo",           tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG-13", generos: ["Terror","Suspenso"],          detalles: { duracion_minutos: 99,  sinopsis: "Una familia se muda a una casa con secretos oscuros." } },
  { _id: cIds[8],  titulo: "El Camino de los Dioses",     tipo_contenido: "Pelicula", anio_lanzamiento: 2019, clasificacion_edad: "PG-13", generos: ["Aventura","Fantasia"],        detalles: { duracion_minutos: 142, sinopsis: "Un joven viaja al reino de los dioses para salvar su aldea." } },
  { _id: cIds[9],  titulo: "Polvo de Estrellas",          tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "PG",    generos: ["Ciencia Ficcion","Drama"],    detalles: { duracion_minutos: 115, sinopsis: "Dos astronautas quedan varados en una estacion espacial." } },
  { _id: cIds[10], titulo: "La Conspiracion",             tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "R",     generos: ["Thriller","Politico"],        detalles: { duracion_minutos: 122, sinopsis: "Una periodista expone una red de corrupcion internacional." } },
  { _id: cIds[11], titulo: "Hijos del Viento",            tipo_contenido: "Pelicula", anio_lanzamiento: 2020, clasificacion_edad: "PG",    generos: ["Animacion","Familia"],        detalles: { duracion_minutos: 88,  sinopsis: "Un grupo de animales habla sobre el libre albedrio." } },
  { _id: cIds[12], titulo: "Fuego Cruzado",               tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "R",     generos: ["Accion","Crimen"],            detalles: { duracion_minutos: 105, sinopsis: "Dos bandas rivales se unen para combatir una amenaza mayor." } },
  { _id: cIds[13], titulo: "El Peso del Silencio",        tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "PG-13", generos: ["Drama","Misterio"],           detalles: { duracion_minutos: 110, sinopsis: "Un sordo descubre que puede escuchar pensamientos ajenos." } },
  { _id: cIds[14], titulo: "Marea Alta",                  tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "PG-13", generos: ["Suspenso","Accion"],          detalles: { duracion_minutos: 97,  sinopsis: "Un surfista descubre laboratorios ilegales bajo el oceano." } },
  { _id: cIds[15], titulo: "La Ecuacion Perfecta",        tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG",    generos: ["Drama","Biografia"],          detalles: { duracion_minutos: 130, sinopsis: "La vida de una matematica que cambio el mundo." } },
  { _id: cIds[16], titulo: "Hielo Negro",                 tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "R",     generos: ["Crimen","Thriller"],          detalles: { duracion_minutos: 107, sinopsis: "Un detective investiga muertes misteriosas en el Artico." } },
  { _id: cIds[17], titulo: "El Maestro de las Sombras",   tipo_contenido: "Pelicula", anio_lanzamiento: 2020, clasificacion_edad: "PG-13", generos: ["Fantasia","Accion"],          detalles: { duracion_minutos: 120, sinopsis: "Un mago renegado enfrenta a su antiguo mentor." } },
  { _id: cIds[18], titulo: "Voces del Abismo",            tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "R",     generos: ["Terror","Sobrenatural"],      detalles: { duracion_minutos: 94,  sinopsis: "Un psiquiatra comienza a oir voces de sus pacientes muertos." } },
  { _id: cIds[19], titulo: "Cruce de Destinos",           tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG-13", generos: ["Romance","Drama"],            detalles: { duracion_minutos: 116, sinopsis: "Tres personas de paises distintos se cruzan en un vuelo historico." } },
  { _id: cIds[20], titulo: "Titan Caido",                 tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "PG-13", generos: ["Accion","Ciencia Ficcion"],   detalles: { duracion_minutos: 138, sinopsis: "Una colonia en Marte lucha por su independencia." } },
  { _id: cIds[21], titulo: "El Protocolo Omega",          tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "R",     generos: ["Thriller","Espionaje"],       detalles: { duracion_minutos: 111, sinopsis: "Un agente debe impedir el fin del mundo en 48 horas." } },
  { _id: cIds[22], titulo: "Raices Eternas",              tipo_contenido: "Pelicula", anio_lanzamiento: 2020, clasificacion_edad: "PG",    generos: ["Drama","Historia"],           detalles: { duracion_minutos: 125, sinopsis: "La historia de tres generaciones de una familia indigena." } },
  { _id: cIds[23], titulo: "Labyrinth Zero",              tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG-13", generos: ["Ciencia Ficcion","Misterio"], detalles: { duracion_minutos: 103, sinopsis: "Un equipo de cientificos queda atrapado en una simulacion." } },
  { _id: cIds[24], titulo: "La Danza del Fuego",          tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "PG",    generos: ["Animacion","Fantasia"],       detalles: { duracion_minutos: 90,  sinopsis: "Una bailarina descubre que su danza puede alterar la realidad." } },
  { _id: cIds[25], titulo: "Punto de Quiebre",            tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "R",     generos: ["Drama","Crimen"],             detalles: { duracion_minutos: 117, sinopsis: "Un abogado debe defender a alguien que sabe que es culpable." } },
  { _id: cIds[26], titulo: "Mas Alla del Tiempo",         tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG-13", generos: ["Ciencia Ficcion","Aventura"], detalles: { duracion_minutos: 131, sinopsis: "Un reloj antiguo permite viajar entre epocas historicas." } },
  { _id: cIds[27], titulo: "La Furia del Oceano",         tipo_contenido: "Pelicula", anio_lanzamiento: 2020, clasificacion_edad: "PG-13", generos: ["Accion","Aventura"],          detalles: { duracion_minutos: 109, sinopsis: "Un marinero enfrenta una tormenta de proporciones miticas." } },
  { _id: cIds[28], titulo: "Cero Absoluto",               tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "R",     generos: ["Thriller","Ciencia Ficcion"], detalles: { duracion_minutos: 124, sinopsis: "La temperatura global cae en picada y la humanidad tiene 72 horas." } },
  { _id: cIds[29], titulo: "El Arte de Desaparecer",      tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "PG-13", generos: ["Misterio","Suspenso"],        detalles: { duracion_minutos: 100, sinopsis: "Una illusionista desaparece y nadie sabe si fue real o truco." } },
  { _id: cIds[30], titulo: "Corazon de Acero",            tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "PG",    generos: ["Deportes","Drama"],           detalles: { duracion_minutos: 113, sinopsis: "Un boxeador retirado vuelve al ring por su familia." } },
  { _id: cIds[31], titulo: "La Profecia",                 tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "PG-13", generos: ["Terror","Fantasia"],          detalles: { duracion_minutos: 101, sinopsis: "Un monje descubre un manuscrito que predice el fin del mundo." } },
  { _id: cIds[32], titulo: "Noche de Lobos",              tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "R",     generos: ["Terror","Accion"],            detalles: { duracion_minutos: 96,  sinopsis: "Un pueblo rural es atacado por criaturas desconocidas." } },
  { _id: cIds[33], titulo: "El Vuelo del Aguila",         tipo_contenido: "Pelicula", anio_lanzamiento: 2020, clasificacion_edad: "PG",    generos: ["Aventura","Familia"],         detalles: { duracion_minutos: 92,  sinopsis: "Un chico rescata un aguila herida y aprende el valor de la libertad." } },
  { _id: cIds[34], titulo: "Sangre y Cromo",              tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "R",     generos: ["Accion","Cyberpunk"],         detalles: { duracion_minutos: 126, sinopsis: "En 2087 los humanos modificados luchan por sus derechos." } },
  { _id: cIds[35], titulo: "El Sueno del Alquimista",     tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "PG-13", generos: ["Fantasia","Aventura"],        detalles: { duracion_minutos: 119, sinopsis: "Un joven aprende los secretos de la alquimia para salvar su reino." } },
  { _id: cIds[36], titulo: "Orbita 7",                    tipo_contenido: "Pelicula", anio_lanzamiento: 2021, clasificacion_edad: "PG-13", generos: ["Ciencia Ficcion","Thriller"], detalles: { duracion_minutos: 108, sinopsis: "Una estacion espacial pierde contacto con la Tierra." } },
  { _id: cIds[37], titulo: "La Noche mas Larga",          tipo_contenido: "Pelicula", anio_lanzamiento: 2023, clasificacion_edad: "R",     generos: ["Crimen","Suspenso"],          detalles: { duracion_minutos: 114, sinopsis: "Un policia corrupto debe sobrevivir una noche de ajuste de cuentas." } },
  { _id: cIds[38], titulo: "Ecos del Universo",           tipo_contenido: "Pelicula", anio_lanzamiento: 2020, clasificacion_edad: "PG",    generos: ["Documental","Ciencia"],       detalles: { duracion_minutos: 87,  sinopsis: "Un viaje visual por los misterios del cosmos." } },
  { _id: cIds[39], titulo: "Sin Retorno",                 tipo_contenido: "Pelicula", anio_lanzamiento: 2022, clasificacion_edad: "R",     generos: ["Thriller","Drama"],           detalles: { duracion_minutos: 121, sinopsis: "Un hombre inocente preso debe demostrar su inocencia desde adentro." } },
]

const series = [
  { _id: cIds[40], titulo: "Neon Dystopia",     tipo_contenido: "Serie", anio_lanzamiento: 2022, clasificacion_edad: "TV-MA", generos: ["Accion","Cyberpunk"],          detalles: { cantidad_temporadas: 2, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Despertar",        duracion_minutos:52 },
      { temporada:1, numero_episodio:2, titulo_episodio:"La Ciudad Rota",   duracion_minutos:48 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Conexion Ilegal",  duracion_minutos:51 },
      { temporada:1, numero_episodio:4, titulo_episodio:"El Mercado Gris",  duracion_minutos:47 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Renacimiento",     duracion_minutos:55 },
      { temporada:2, numero_episodio:2, titulo_episodio:"Traicion Digital", duracion_minutos:50 },
    ]
  },
  { _id: cIds[41], titulo: "Reinos en Guerra",  tipo_contenido: "Serie", anio_lanzamiento: 2021, clasificacion_edad: "TV-MA", generos: ["Fantasia","Drama"],             detalles: { cantidad_temporadas: 3, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"El Trono Vacio",   duracion_minutos:65 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Alianzas Rotas",   duracion_minutos:58 },
      { temporada:1, numero_episodio:3, titulo_episodio:"La Profecia",      duracion_minutos:62 },
      { temporada:2, numero_episodio:1, titulo_episodio:"La Gran Batalla",  duracion_minutos:70 },
      { temporada:2, numero_episodio:2, titulo_episodio:"Cenizas",          duracion_minutos:60 },
      { temporada:3, numero_episodio:1, titulo_episodio:"El Final del Rey", duracion_minutos:75 },
    ]
  },
  { _id: cIds[42], titulo: "Pulso",              tipo_contenido: "Serie", anio_lanzamiento: 2023, clasificacion_edad: "TV-14", generos: ["Drama","Medico"],               detalles: { cantidad_temporadas: 1, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Primera Guardia",  duracion_minutos:45 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Codigo Azul",      duracion_minutos:43 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Tiempo de Crisis", duracion_minutos:46 },
      { temporada:1, numero_episodio:4, titulo_episodio:"Sin Anestesia",    duracion_minutos:44 },
      { temporada:1, numero_episodio:5, titulo_episodio:"El Diagnostico",   duracion_minutos:48 },
    ]
  },
  { _id: cIds[43], titulo: "Archivo Secreto",   tipo_contenido: "Serie", anio_lanzamiento: 2022, clasificacion_edad: "TV-14", generos: ["Misterio","Thriller"],          detalles: { cantidad_temporadas: 2, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Carpeta 001",      duracion_minutos:42 },
      { temporada:1, numero_episodio:2, titulo_episodio:"El Testigo",       duracion_minutos:40 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Pista Falsa",      duracion_minutos:43 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Caso Reabierto",   duracion_minutos:44 },
      { temporada:2, numero_episodio:2, titulo_episodio:"La Verdad",        duracion_minutos:46 },
    ]
  },
  { _id: cIds[44], titulo: "Cosmos Vivo",        tipo_contenido: "Serie", anio_lanzamiento: 2021, clasificacion_edad: "TV-G",  generos: ["Documental","Ciencia"],         detalles: { cantidad_temporadas: 2, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"El Universo",       duracion_minutos:50 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Galaxias",          duracion_minutos:50 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Agujeros Negros",   duracion_minutos:52 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Vida Extraterrestre",duracion_minutos:55 },
    ]
  },
  { _id: cIds[45], titulo: "La Sombra del Lobo", tipo_contenido: "Serie", anio_lanzamiento: 2020, clasificacion_edad: "TV-MA", generos: ["Crimen","Drama"],               detalles: { cantidad_temporadas: 4, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"El Inicio",         duracion_minutos:55 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Territorio Ajeno",  duracion_minutos:53 },
      { temporada:2, numero_episodio:1, titulo_episodio:"La Expansion",      duracion_minutos:57 },
      { temporada:2, numero_episodio:2, titulo_episodio:"Sangre Fria",       duracion_minutos:54 },
      { temporada:3, numero_episodio:1, titulo_episodio:"La Caida",          duracion_minutos:58 },
      { temporada:4, numero_episodio:1, titulo_episodio:"Redención",         duracion_minutos:65 },
    ]
  },
  { _id: cIds[46], titulo: "Tecnomentes",        tipo_contenido: "Serie", anio_lanzamiento: 2023, clasificacion_edad: "TV-14", generos: ["Ciencia Ficcion","Drama"],      detalles: { cantidad_temporadas: 1, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Implante",          duracion_minutos:44 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Sobrehumano",       duracion_minutos:46 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Rechazo",           duracion_minutos:43 },
      { temporada:1, numero_episodio:4, titulo_episodio:"El Colectivo",      duracion_minutos:47 },
    ]
  },
  { _id: cIds[47], titulo: "Cartas al Viento",   tipo_contenido: "Serie", anio_lanzamiento: 2022, clasificacion_edad: "TV-PG", generos: ["Romance","Drama"],              detalles: { cantidad_temporadas: 2, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Primera Carta",     duracion_minutos:40 },
      { temporada:1, numero_episodio:2, titulo_episodio:"El Encuentro",      duracion_minutos:42 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Distancia",         duracion_minutos:41 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Reencuentro",       duracion_minutos:45 },
      { temporada:2, numero_episodio:2, titulo_episodio:"Final Feliz",       duracion_minutos:48 },
    ]
  },
  { _id: cIds[48], titulo: "Guardianes del Vacio",tipo_contenido: "Serie", anio_lanzamiento: 2021, clasificacion_edad: "TV-14", generos: ["Accion","Ciencia Ficcion"],     detalles: { cantidad_temporadas: 3, estado_emision: "Cancelada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Reclutamiento",     duracion_minutos:48 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Primera Mision",    duracion_minutos:50 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Traicion",          duracion_minutos:52 },
      { temporada:3, numero_episodio:1, titulo_episodio:"El Sacrificio",     duracion_minutos:55 },
    ]
  },
  { _id: cIds[49], titulo: "El Consultor",       tipo_contenido: "Serie", anio_lanzamiento: 2023, clasificacion_edad: "TV-MA", generos: ["Thriller","Crimen"],            detalles: { cantidad_temporadas: 1, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"El Primer Caso",    duracion_minutos:45 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Metodologia",       duracion_minutos:44 },
      { temporada:1, numero_episodio:3, titulo_episodio:"El Cliente",        duracion_minutos:46 },
      { temporada:1, numero_episodio:4, titulo_episodio:"Trampa Tendida",    duracion_minutos:48 },
      { temporada:1, numero_episodio:5, titulo_episodio:"El Cierre",         duracion_minutos:50 },
    ]
  },
  { _id: cIds[50], titulo: "Mundos Paralelos",   tipo_contenido: "Serie", anio_lanzamiento: 2022, clasificacion_edad: "TV-14", generos: ["Ciencia Ficcion","Misterio"],   detalles: { cantidad_temporadas: 2, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"El Portal",         duracion_minutos:50 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Yo Alterno",        duracion_minutos:48 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Divergencia",       duracion_minutos:51 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Colision",          duracion_minutos:54 },
      { temporada:2, numero_episodio:2, titulo_episodio:"El Colapso",        duracion_minutos:56 },
    ]
  },
  { _id: cIds[51], titulo: "Dinastia",           tipo_contenido: "Serie", anio_lanzamiento: 2020, clasificacion_edad: "TV-MA", generos: ["Drama","Politico"],             detalles: { cantidad_temporadas: 5, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Herencia",          duracion_minutos:60 },
      { temporada:1, numero_episodio:2, titulo_episodio:"El Juego del Poder",duracion_minutos:58 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Nuevos Enemigos",   duracion_minutos:62 },
      { temporada:3, numero_episodio:1, titulo_episodio:"Traicion en Casa",  duracion_minutos:65 },
      { temporada:5, numero_episodio:1, titulo_episodio:"El Legado",         duracion_minutos:70 },
    ]
  },
  { _id: cIds[52], titulo: "Rutas Salvajes",     tipo_contenido: "Serie", anio_lanzamiento: 2021, clasificacion_edad: "TV-PG", generos: ["Aventura","Documental"],        detalles: { cantidad_temporadas: 3, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"La Jungla",         duracion_minutos:45 },
      { temporada:1, numero_episodio:2, titulo_episodio:"El Desierto",       duracion_minutos:47 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Los Andes",         duracion_minutos:48 },
      { temporada:3, numero_episodio:1, titulo_episodio:"El Artico",         duracion_minutos:50 },
    ]
  },
  { _id: cIds[53], titulo: "Codigo Humano",      tipo_contenido: "Serie", anio_lanzamiento: 2023, clasificacion_edad: "TV-14", generos: ["Drama","Psicologico"],          detalles: { cantidad_temporadas: 1, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Comportamiento",    duracion_minutos:44 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Impulso",           duracion_minutos:43 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Condicionamiento",  duracion_minutos:45 },
    ]
  },
  { _id: cIds[54], titulo: "Abismo",             tipo_contenido: "Serie", anio_lanzamiento: 2022, clasificacion_edad: "TV-MA", generos: ["Terror","Suspenso"],            detalles: { cantidad_temporadas: 2, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Descenso",          duracion_minutos:48 },
      { temporada:1, numero_episodio:2, titulo_episodio:"La Criatura",       duracion_minutos:50 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Sin Salida",        duracion_minutos:52 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Resurge",           duracion_minutos:55 },
      { temporada:2, numero_episodio:2, titulo_episodio:"El Abismo Final",   duracion_minutos:58 },
    ]
  },
  { _id: cIds[55], titulo: "Generacion Z",       tipo_contenido: "Serie", anio_lanzamiento: 2021, clasificacion_edad: "TV-14", generos: ["Comedia","Drama"],              detalles: { cantidad_temporadas: 3, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"El Primer Dia",     duracion_minutos:30 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Likes",             duracion_minutos:28 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Viral",             duracion_minutos:31 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Cancel Culture",    duracion_minutos:29 },
      { temporada:3, numero_episodio:1, titulo_episodio:"Adulting",          duracion_minutos:32 },
    ]
  },
  { _id: cIds[56], titulo: "Iron Harbor",        tipo_contenido: "Serie", anio_lanzamiento: 2020, clasificacion_edad: "TV-MA", generos: ["Accion","Crimen"],              detalles: { cantidad_temporadas: 4, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Puerto Muerto",     duracion_minutos:55 },
      { temporada:1, numero_episodio:2, titulo_episodio:"El Contrabando",    duracion_minutos:53 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Fuerza Bruta",      duracion_minutos:57 },
      { temporada:3, numero_episodio:1, titulo_episodio:"El Jefe",           duracion_minutos:60 },
      { temporada:4, numero_episodio:1, titulo_episodio:"Fin de la Era",     duracion_minutos:65 },
    ]
  },
  { _id: cIds[57], titulo: "Quantum",            tipo_contenido: "Serie", anio_lanzamiento: 2023, clasificacion_edad: "TV-14", generos: ["Ciencia Ficcion","Thriller"],   detalles: { cantidad_temporadas: 1, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"Superposicion",     duracion_minutos:46 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Entrelazamiento",   duracion_minutos:48 },
      { temporada:1, numero_episodio:3, titulo_episodio:"Colapso",           duracion_minutos:50 },
      { temporada:1, numero_episodio:4, titulo_episodio:"El Observador",     duracion_minutos:52 },
    ]
  },
  { _id: cIds[58], titulo: "Los Elegidos",       tipo_contenido: "Serie", anio_lanzamiento: 2022, clasificacion_edad: "TV-14", generos: ["Fantasia","Accion"],            detalles: { cantidad_temporadas: 2, estado_emision: "En Emision" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"El Llamado",        duracion_minutos:50 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Poderes",           duracion_minutos:48 },
      { temporada:1, numero_episodio:3, titulo_episodio:"El Enemigo",        duracion_minutos:52 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Reunion",           duracion_minutos:55 },
      { temporada:2, numero_episodio:2, titulo_episodio:"La Batalla Final",  duracion_minutos:60 },
    ]
  },
  { _id: cIds[59], titulo: "Resonancia",         tipo_contenido: "Serie", anio_lanzamiento: 2021, clasificacion_edad: "TV-MA", generos: ["Drama","Psicologico"],          detalles: { cantidad_temporadas: 3, estado_emision: "Finalizada" },
    episodios: [
      { temporada:1, numero_episodio:1, titulo_episodio:"La Frecuencia",     duracion_minutos:45 },
      { temporada:1, numero_episodio:2, titulo_episodio:"Vibracion",         duracion_minutos:44 },
      { temporada:2, numero_episodio:1, titulo_episodio:"Amplitud",          duracion_minutos:47 },
      { temporada:2, numero_episodio:2, titulo_episodio:"Silencio",          duracion_minutos:46 },
      { temporada:3, numero_episodio:1, titulo_episodio:"El Eco Final",      duracion_minutos:50 },
    ]
  },
]

db.contenido.insertMany([...peliculas, ...series])
print("✓ contenido:    " + db.contenido.countDocuments() + " documentos")

// =============================================================
// 3. COLECCIÓN: usuarios  (50 documentos)
// =============================================================
const uIds = Array.from({length: 50}, () => new ObjectId())
const nombres = [
  "Sofia Ramirez","Carlos Mendez","Maria Lopez","Andres Torres","Valentina Castro",
  "Diego Vargas","Camila Jimenez","Sebastian Reyes","Isabella Morales","Santiago Perez",
  "Daniela Herrera","Juan Martinez","Paula Gomez","Felipe Sanchez","Laura Fernandez",
  "Miguel Rojas","Natalia Silva","Alejandro Diaz","Gabriela Rios","David Cruz",
  "Sara Medina","Nicolas Guerrero","Ana Ortega","Luis Romero","Valeria Navarro",
  "Jorge Rueda","Monica Salazar","Ricardo Pacheco","Gloria Mora","Andres Cardona",
  "Lina Suarez","Hector Montoya","Patricia Agudelo","Cesar Zapata","Marcela Ospina",
  "Alberto Florez","Jenny Castaño","Oscar Leon","Adriana Pardo","Fernando Arango",
  "Rocio Quintero","Daniel Cano","Esperanza Vega","Rodrigo Mejia","Pilar Acosta",
  "Ernesto Soto","Claudia Gil","Roberto Pena","Martha Lozano","Gustavo Bernal"
]
const estados = ["Activo","Activo","Activo","Activo","Inactivo","Activo","Activo","Suspendido","Activo","Activo"]
const planList = [pEst,pBas,pBas,pStd,pStd,pStd,pPre,pPre,pPre,pFam]

const usuarios = uIds.map((id, i) => {
  const nombre = nombres[i]
  const emailName = nombre.toLowerCase().replace(/ /g,'.')
  const planId = planList[i % 10]
  const planData = [
    {nombre_plan:"Estudiante",precio:5.99,max_resolucion:"720p",max_pantallas:1},
    {nombre_plan:"Basico",    precio:7.99,max_resolucion:"720p",max_pantallas:1},
    {nombre_plan:"Basico",    precio:7.99,max_resolucion:"720p",max_pantallas:1},
    {nombre_plan:"Estandar",  precio:11.99,max_resolucion:"1080p",max_pantallas:2},
    {nombre_plan:"Estandar",  precio:11.99,max_resolucion:"1080p",max_pantallas:2},
    {nombre_plan:"Estandar",  precio:11.99,max_resolucion:"1080p",max_pantallas:2},
    {nombre_plan:"Premium",   precio:15.99,max_resolucion:"4K",max_pantallas:4},
    {nombre_plan:"Premium",   precio:15.99,max_resolucion:"4K",max_pantallas:4},
    {nombre_plan:"Premium",   precio:15.99,max_resolucion:"4K",max_pantallas:4},
    {nombre_plan:"Familiar",  precio:19.99,max_resolucion:"4K",max_pantallas:6},
  ][i % 10]

  const estadoSus = i < 40 ? "Activa" : (i < 46 ? "Cancelada" : "Vencida")
  const fechaInicio = new Date(2024, i % 12, (i % 28) + 1)
  const fechaFin    = new Date(2025, i % 12, (i % 28) + 1)

  return {
    _id: id,
    nombre,
    email: emailName + i + "@mail.com",
    password_hash: "$2b$12$hash_" + i,
    fecha_registro: fechaInicio,
    estado: estados[i % 10],
    suscripcion_activa: {
      id_suscripcion: new ObjectId(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      estado_suscripcion: estadoSus,
      plan: { id_plan: planId, ...planData }
    }
  }
})

db.usuarios.insertMany(usuarios)
print("✓ usuarios:     " + db.usuarios.countDocuments() + " documentos")

// =============================================================
// 4. COLECCIÓN: suscripciones  (50 documentos con facturas y pagos embebidos)
// =============================================================
const metodos = ["Tarjeta de Credito","PayPal","Transferencia","Cripto"]
const estadosPago = ["Completado","Completado","Completado","Rechazado","Reembolsado"]

const suscripciones = usuarios.map((u, i) => {
  const numFacturas = 3 + (i % 6)   // entre 3 y 8 facturas
  const facturas = []
  for (let f = 0; f < numFacturas; f++) {
    const precio = u.suscripcion_activa.plan.precio
    const subtotal = parseFloat((precio * 0.86).toFixed(2))
    const impuesto = parseFloat((precio * 0.14).toFixed(2))
    const total    = precio
    const estadoFact = (f < numFacturas - 1) ? "Pagada" : (i % 7 === 0 ? "Pendiente" : "Pagada")
    const fechaFact  = new Date(2024, f, 15)
    facturas.push({
      _id: new ObjectId(),
      fecha_emision: fechaFact,
      subtotal,
      impuestos: impuesto,
      total,
      estado_factura: estadoFact,
      pagos: [{
        _id: new ObjectId(),
        metodo_pago: metodos[(i + f) % 4],
        fecha_transaccion: new Date(fechaFact.getTime() + 3600000),
        monto: total,
        estado_pago: estadoFact === "Pagada" ? "Completado" : estadosPago[f % 5]
      }]
    })
  }
  return {
    _id: u.suscripcion_activa.id_suscripcion,
    id_usuario: u._id,
    id_plan: u.suscripcion_activa.plan.id_plan,
    fecha_inicio: u.suscripcion_activa.fecha_inicio,
    fecha_fin:    u.suscripcion_activa.fecha_fin,
    estado_suscripcion: u.suscripcion_activa.estado_suscripcion,
    facturas,
    auditoria: i % 5 === 0 ? [{
      estado_anterior: "Activa",
      estado_nuevo: "Cancelada",
      fecha_cambio: new Date(2024, 5, 1),
      usuario_db: "app_user"
    }] : []
  }
})

db.suscripciones.insertMany(suscripciones)
print("✓ suscripciones:" + db.suscripciones.countDocuments() + " documentos")

// =============================================================
// 5. COLECCIÓN: historial  (300 documentos)
// =============================================================
const historialDocs = []
// 40 usuarios activos generan entre 5 y 10 reproducciones recientes
for (let i = 0; i < 40; i++) {
  const numRep = 5 + (i % 6)
  for (let r = 0; r < numRep; r++) {
    const diasAtras = r * 5 + (i % 10)  // maximo ~90 dias atras para usuarios activos
    const fecha = new Date(); fecha.setDate(fecha.getDate() - diasAtras)
    historialDocs.push({
      _id: new ObjectId(),
      id_usuario:  uIds[i],
      id_contenido: cIds[(i * 3 + r) % 60],
      fecha_reproduccion: fecha,
      tiempo_visto_segundos: 1200 + (r * 800) + (i * 100)
    })
  }
}
// 10 usuarios inactivos (sin reproducciones en los ultimos 90 dias)
for (let i = 40; i < 50; i++) {
  const numRep = 2 + (i % 3)
  for (let r = 0; r < numRep; r++) {
    const diasAtras = 95 + r * 10 + i   // mas de 90 dias
    const fecha = new Date(); fecha.setDate(fecha.getDate() - diasAtras)
    historialDocs.push({
      _id: new ObjectId(),
      id_usuario:  uIds[i],
      id_contenido: cIds[(i + r) % 60],
      fecha_reproduccion: fecha,
      tiempo_visto_segundos: 600 + r * 300
    })
  }
}

db.historial.insertMany(historialDocs)
print("✓ historial:    " + db.historial.countDocuments() + " documentos")

// =============================================================
// 6. ÍNDICES
// =============================================================
db.usuarios.createIndex({ email: 1 }, { unique: true })
db.usuarios.createIndex({ "suscripcion_activa.estado_suscripcion": 1 })
db.contenido.createIndex({ tipo_contenido: 1 })
db.contenido.createIndex({ generos: 1 })
db.contenido.createIndex({ anio_lanzamiento: -1 })
db.suscripciones.createIndex({ id_usuario: 1 })
db.historial.createIndex({ id_usuario: 1, fecha_reproduccion: -1 })
db.historial.createIndex({ id_contenido: 1 })
db.historial.createIndex({ fecha_reproduccion: 1 })
print("\n✓ Indices creados correctamente")

print("\n========================================================")
print("  RESUMEN FINAL")
print("========================================================")
print("  planes:         " + db.planes.countDocuments())
print("  usuarios:       " + db.usuarios.countDocuments())
print("  contenido:      " + db.contenido.countDocuments())
print("  suscripciones:  " + db.suscripciones.countDocuments())
print("  historial:      " + db.historial.countDocuments())
print("========================================================")
print("  TOTAL:          " + (
  db.planes.countDocuments() + db.usuarios.countDocuments() +
  db.contenido.countDocuments() + db.suscripciones.countDocuments() +
  db.historial.countDocuments()
) + " documentos\n")


// =============================================================
// CONSULTAS SIGNIFICATIVAS
// =============================================================

print("========================================================")
print("  CONSULTA 1: Top 10 contenido mas popular")
print("========================================================")
db.historial.aggregate([
  { $group: {
      _id: "$id_contenido",
      total_reproducciones: { $sum: 1 },
      minutos_totales: { $sum: { $divide: ["$tiempo_visto_segundos", 60] } }
  }},
  { $sort: { total_reproducciones: -1 } },
  { $limit: 10 },
  { $lookup: {
      from: "contenido",
      localField: "_id",
      foreignField: "_id",
      as: "info"
  }},
  { $unwind: "$info" },
  { $project: {
      _id: 0,
      titulo: "$info.titulo",
      tipo: "$info.tipo_contenido",
      generos: "$info.generos",
      total_reproducciones: 1,
      minutos_totales: { $round: ["$minutos_totales", 2] }
  }}
]).forEach(r => printjson(r))


print("\n========================================================")
print("  CONSULTA 2: Ingresos mensuales por plan (solo Pagadas)")
print("========================================================")
db.suscripciones.aggregate([
  { $unwind: "$facturas" },
  { $match: { "facturas.estado_factura": "Pagada" } },
  { $lookup: {
      from: "planes",
      localField: "id_plan",
      foreignField: "_id",
      as: "plan"
  }},
  { $unwind: "$plan" },
  { $group: {
      _id: {
        nombre_plan: "$plan.nombre_plan",
        mes: { $dateToString: { format: "%Y-%m", date: "$facturas.fecha_emision" } }
      },
      facturas_pagadas: { $sum: 1 },
      ingresos_totales: { $sum: "$facturas.total" }
  }},
  { $sort: { "_id.mes": -1, ingresos_totales: -1 } },
  { $project: {
      _id: 0,
      plan: "$_id.nombre_plan",
      mes: "$_id.mes",
      facturas_pagadas: 1,
      ingresos_totales: { $round: ["$ingresos_totales", 2] }
  }}
]).forEach(r => printjson(r))


print("\n========================================================")
print("  CONSULTA 3: Usuarios con suscripcion activa sin")
print("              actividad en los ultimos 90 dias")
print("========================================================")
const hace90dias = new Date(); hace90dias.setDate(hace90dias.getDate() - 90)

const usuariosConActividad = db.historial.distinct("id_usuario", {
  fecha_reproduccion: { $gte: hace90dias }
})

db.usuarios.aggregate([
  { $match: {
      "suscripcion_activa.estado_suscripcion": "Activa",
      _id: { $nin: usuariosConActividad }
  }},
  { $project: {
      _id: 0,
      nombre: 1,
      email: 1,
      plan: "$suscripcion_activa.plan.nombre_plan",
      precio_plan: "$suscripcion_activa.plan.precio",
      fecha_inicio_suscripcion: "$suscripcion_activa.fecha_inicio"
  }}
]).forEach(r => printjson(r))


print("\n========================================================")
print("  CONSULTA 4: Series en emision con mas episodios")
print("========================================================")
db.contenido.aggregate([
  { $match: { tipo_contenido: "Serie", "detalles.estado_emision": "En Emision" } },
  { $project: {
      _id: 0,
      titulo: 1,
      generos: 1,
      temporadas: "$detalles.cantidad_temporadas",
      total_episodios: { $size: "$episodios" }
  }},
  { $sort: { total_episodios: -1 } }
]).forEach(r => printjson(r))


print("\n========================================================")
print("  CONSULTA 5: Ingresos totales y promedio por metodo")
print("              de pago (proyeccion y agrupacion)")
print("========================================================")
db.suscripciones.aggregate([
  { $unwind: "$facturas" },
  { $unwind: "$facturas.pagos" },
  { $match: { "facturas.pagos.estado_pago": "Completado" } },
  { $group: {
      _id: "$facturas.pagos.metodo_pago",
      total_transacciones: { $sum: 1 },
      ingresos_totales:    { $sum: "$facturas.pagos.monto" },
      promedio_por_pago:   { $avg: "$facturas.pagos.monto" }
  }},
  { $project: {
      _id: 0,
      metodo_pago: "$_id",
      total_transacciones: 1,
      ingresos_totales:  { $round: ["$ingresos_totales",  2] },
      promedio_por_pago: { $round: ["$promedio_por_pago", 2] }
  }},
  { $sort: { ingresos_totales: -1 } }
]).forEach(r => printjson(r))


// =============================================================
// NUEVAS COLECCIONES NATIVAS MONGODB
// =============================================================

// Limpiar nuevas colecciones si existen
var newCols = ['comentarios','resenas','clasificaciones'];
newCols.forEach(c => { try { db[c].drop() } catch(e) {} })

// =============================================================
// 6. COLECCIÓN: comentarios
//    Diseño MongoDB: respuestas EMBEBIDAS (árbol de comentarios)
// =============================================================
const textos = [
  "Increible pelicula, no me la esperaba para nada",
  "La trama estuvo muy bien desarrollada desde el inicio",
  "Los efectos visuales son simplemente espectaculares",
  "Me parecio un poco lenta al comienzo pero luego engancha",
  "Una de las mejores series que he visto este año",
  "El final me dejo con muchas preguntas, esperando temporada 2",
  "Los actores hacen un trabajo extraordinario en cada escena",
  "Muy recomendada para los fans del genero, no decepciona",
  "La fotografia y la musica complementan perfectamente la historia",
  "Esperaba mas del desenlace, pero en general muy buena",
  "No pude parar de ver los episodios, la vi de una sola vez",
  "La historia es original y fresca comparada con otras del genero",
  "Algunos capitulos son mas flojos pero el conjunto es solido",
  "Excelente produccion, se nota la inversion en cada detalle",
  "El personaje principal es muy complejo e interesante",
]
const respTextos = [
  "Totalmente de acuerdo contigo!",
  "Yo pense lo mismo cuando la vi",
  "Si, ese fue mi momento favorito tambien",
  "Discrepo un poco, a mi me parecio que faltaba algo",
  "Espera al episodio 4, cambia todo",
  "Exactamente lo que yo sentia al verla",
  "Muy buen punto, no lo habia pensado asi",
  "A mi tampoco me convencio del todo ese aspecto",
]

var comentariosData = [];
for (var i = 0; i < 80; i++) {
  var numRespuestas = i % 4; // 0 a 3 respuestas por comentario
  var respuestas = [];
  for (var r = 0; r < numRespuestas; r++) {
    var fechaResp = new Date(2024, (i+r) % 12, ((i*2+r) % 27) + 1, 14+r, 30);
    respuestas.push({
      id_usuario_respuesta: uIds[(i + r + 5) % 50],
      texto_respuesta: respTextos[(i + r) % respTextos.length],
      fecha_respuesta: fechaResp
    });
  }
  var fechaComent = new Date(2024, i % 12, (i % 27) + 1, 10 + (i%8), 0);
  comentariosData.push({
    _id: new ObjectId(),
    id_usuario:   uIds[i % 50],
    id_contenido: cIds[i % 60],
    texto: textos[i % textos.length],
    fecha_comentario: fechaComent,
    respuestas: respuestas
  });
}
db.comentarios.insertMany(comentariosData);
print("✓ comentarios:  " + db.comentarios.countDocuments() + " documentos")

// =============================================================
// 7. COLECCIÓN: resenas
//    Diseño MongoDB: documento completo con votos y spoilers
// =============================================================
const titResenas = [
  "Una obra maestra del cine moderno",
  "Decepcionante para lo que prometia",
  "Entretenida pero no excepcional",
  "La mejor del año sin duda",
  "Vale la pena verla una vez",
  "No cumple las expectativas",
  "Sorprendentemente buena",
  "Un clasico instantaneo",
  "Correcta pero olvidable",
  "Imprescindible para los fans",
]
const cuerposResenas = [
  "Desde los primeros minutos te atrapa y no te suelta. La direccion es impecable y el guion no tiene fisuras. Totalmente recomendada.",
  "Esperaba mucho mas dado el material original. Los personajes estan mal desarrollados y la historia se siente apresurada al final.",
  "Cumple su proposito de entretenimiento sin grandes ambiciones. Buen ritmo, actuaciones correctas y efectos visuales solidos.",
  "Pocas veces una produccion me ha dejado sin palabras. Cada decision creativa esta perfectamente justificada. Obra de arte.",
  "Una experiencia agradable aunque no revolucionaria. Ideal para ver en familia una tarde de fin de semana sin mayores pretensiones.",
  "El potencial estaba ahi pero no se supo aprovechar. La primera mitad promete mucho y la segunda entrega muy poco.",
  "Me llevo una grata sorpresa. Entro con expectativas bajas y salio convencido de que es una de las mejores del catalogo.",
  "El tiempo dira si es recordada como tal, pero por ahora cumple todos los requisitos para serlo. Historia, tecnica y emocion.",
  "No esta mal, tampoco esta bien. Pasa sin pena ni gloria. Hay mejores opciones en el catalogo si buscas algo de este genero.",
  "Si eres fanático del genero, no puedes perdertela. Tiene todo lo que se le puede pedir y un poco mas. Absolutamente recomendada.",
]

var resenasData = [];
for (var i = 0; i < 100; i++) {
  var puntaje = 5 + (i % 6); // puntajes entre 5 y 10
  var fechaRes = new Date(2024, i % 12, (i % 27) + 1, 9 + (i%10), 15);
  resenasData.push({
    _id: new ObjectId(),
    id_usuario:    uIds[i % 50],
    id_contenido:  cIds[i % 60],
    titulo:        titResenas[i % titResenas.length],
    contenido:     cuerposResenas[i % cuerposResenas.length],
    puntaje:       puntaje,
    tiene_spoilers: i % 5 === 0,
    fecha_resena:  fechaRes,
    votos_utiles:  Math.floor(i * 1.7) % 50
  });
}
db.resenas.insertMany(resenasData);
print("✓ resenas:      " + db.resenas.countDocuments() + " documentos")

// =============================================================
// 8. COLECCIÓN: clasificaciones
//    Diseño MongoDB: índice único usuario+contenido (no duplicar)
// =============================================================
var clasificacionesData = [];
for (var i = 0; i < 120; i++) {
  var uIdx = i % 50;
  var cIdx = Math.floor(i * 1.3) % 60;
  var fechaClas = new Date(2024, i % 12, (i % 27) + 1, 20 + (i%4), i%60);
  clasificacionesData.push({
    _id: new ObjectId(),
    id_usuario:        uIds[uIdx],
    id_contenido:      cIds[cIdx],
    puntaje:           (i % 10) + 1,
    fecha_calificacion: fechaClas
  });
}
db.clasificaciones.insertMany(clasificacionesData);
print("✓ clasificaciones:" + db.clasificaciones.countDocuments() + " documentos")

// Índice único para evitar que un usuario califique el mismo contenido dos veces
db.clasificaciones.createIndex({ id_usuario: 1, id_contenido: 1 }, { unique: false })
db.comentarios.createIndex({ id_contenido: 1, fecha_comentario: -1 })
db.comentarios.createIndex({ id_usuario: 1 })
db.resenas.createIndex({ id_contenido: 1, puntaje: -1 })
db.resenas.createIndex({ votos_utiles: -1 })

print("\n✓ Indices de nuevas colecciones creados")

print("\n========================================================")
print("  RESUMEN FINAL COMPLETO")
print("========================================================")
print("  planes:           " + db.planes.countDocuments())
print("  usuarios:         " + db.usuarios.countDocuments())
print("  contenido:        " + db.contenido.countDocuments())
print("  suscripciones:    " + db.suscripciones.countDocuments())
print("  historial:        " + db.historial.countDocuments())
print("  comentarios:      " + db.comentarios.countDocuments())
print("  resenas:          " + db.resenas.countDocuments())
print("  clasificaciones:  " + db.clasificaciones.countDocuments())
print("========================================================")
print("  TOTAL: " + (
  db.planes.countDocuments() + db.usuarios.countDocuments() +
  db.contenido.countDocuments() + db.suscripciones.countDocuments() +
  db.historial.countDocuments() + db.comentarios.countDocuments() +
  db.resenas.countDocuments() + db.clasificaciones.countDocuments()
) + " documentos\n")

// =============================================================
// CONSULTAS NUEVAS COLECCIONES
// =============================================================

print("========================================================")
print("  CONSULTA 6: Contenido con mas comentarios y")
print("              total de respuestas recibidas")
print("========================================================")
db.comentarios.aggregate([
  { $group: {
      _id: "$id_contenido",
      total_comentarios: { $sum: 1 },
      total_respuestas:  { $sum: { $size: "$respuestas" } }
  }},
  { $sort: { total_comentarios: -1 } },
  { $limit: 8 },
  { $lookup: {
      from: "contenido",
      localField: "_id",
      foreignField: "_id",
      as: "info"
  }},
  { $unwind: "$info" },
  { $project: {
      _id: 0,
      titulo: "$info.titulo",
      tipo: "$info.tipo_contenido",
      total_comentarios: 1,
      total_respuestas: 1
  }}
]).forEach(r => printjson(r))


print("\n========================================================")
print("  CONSULTA 7: Top contenido por puntaje promedio")
print("              de reseñas (minimo 2 reseñas, sin spoilers)")
print("========================================================")
db.resenas.aggregate([
  { $match: { tiene_spoilers: false } },
  { $group: {
      _id: "$id_contenido",
      puntaje_promedio: { $avg: "$puntaje" },
      total_resenas:    { $sum: 1 },
      votos_totales:    { $sum: "$votos_utiles" }
  }},
  { $match: { total_resenas: { $gte: 2 } } },
  { $sort: { puntaje_promedio: -1 } },
  { $limit: 8 },
  { $lookup: {
      from: "contenido",
      localField: "_id",
      foreignField: "_id",
      as: "info"
  }},
  { $unwind: "$info" },
  { $project: {
      _id: 0,
      titulo: "$info.titulo",
      generos: "$info.generos",
      puntaje_promedio: { $round: ["$puntaje_promedio", 1] },
      total_resenas: 1,
      votos_totales: 1
  }}
]).forEach(r => printjson(r))


print("\n========================================================")
print("  CONSULTA 8: Calificacion promedio por genero")
print("              (cruce clasificaciones + contenido)")
print("========================================================")
db.clasificaciones.aggregate([
  { $lookup: {
      from: "contenido",
      localField: "id_contenido",
      foreignField: "_id",
      as: "info"
  }},
  { $unwind: "$info" },
  { $unwind: "$info.generos" },
  { $group: {
      _id: "$info.generos",
      puntaje_promedio: { $avg: "$puntaje" },
      total_calificaciones: { $sum: 1 }
  }},
  { $sort: { puntaje_promedio: -1 } },
  { $project: {
      _id: 0,
      genero: "$_id",
      puntaje_promedio: { $round: ["$puntaje_promedio", 2] },
      total_calificaciones: 1
  }}
]).forEach(r => printjson(r))


print("\n========================================================")
print("  CONSULTA 9: Usuarios mas activos en la comunidad")
print("              (comentarios + reseñas + calificaciones)")
print("========================================================")
db.comentarios.aggregate([
  { $group: { _id: "$id_usuario", comentarios: { $sum: 1 } } },
  { $unionWith: {
      coll: "resenas",
      pipeline: [{ $group: { _id: "$id_usuario", resenas: { $sum: 1 } } }]
  }},
  { $group: {
      _id: "$_id",
      total_actividad: { $sum: { $add: [
        { $ifNull: ["$comentarios", 0] },
        { $ifNull: ["$resenas", 0] }
      ]}}
  }},
  { $sort: { total_actividad: -1 } },
  { $limit: 8 },
  { $lookup: {
      from: "usuarios",
      localField: "_id",
      foreignField: "_id",
      as: "usuario"
  }},
  { $unwind: "$usuario" },
  { $project: {
      _id: 0,
      nombre: "$usuario.nombre",
      plan: "$usuario.suscripcion_activa.plan.nombre_plan",
      total_actividad: 1
  }}
]).forEach(r => printjson(r))

print("\n=== Script finalizado correctamente ===\n")
