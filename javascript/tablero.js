// Funcion para Capitalzar el nombre que traeremos:
function capitalizarNombre(nombre = "") {
    return nombre
        .toString()
        .trim()
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());
}

// Funcion que importa los datos del jugador creado de la Pagina anterior:
function actualizarJugador1ConDatosCreacion(datos) {

    // Crear personaje completo basado en los datos guardados
    const pjCreado = crearPersonaje(datos);

    // --- NUEVO: capitalizar el nombre ----
    if (pjCreado.nombre) {
        pjCreado.nombre = capitalizarNombre(pjCreado.nombre);
    }

    // Aseguramos que siga siendo el jugador ID = 1
    pjCreado.id = 1;

    // Buscar posición del jugador cuyo ID sea 1
    const index = jugadores.findIndex(j => j.id === 1);

    if (index === -1) {
        console.error("ERROR: No se encontró un jugador con ID 1");
        return;
    }

    // Activar al jugador
    pjCreado.activo = true;

    // Inicializar niveles de stats (muy importante)
    inicializarNivelesDeStats(pjCreado);

    // Reemplazarlo completamente
    jugadores[index] = pjCreado;

    console.log("=== Jugador con ID 1 actualizado desde localStorage ===");
    console.log(jugadores[index]);

    actualizarClasesSegunJugador1();
    asignarImagenSegunClase(pjCreado);
}


// Funcion que actualiza a los demas jugadores, segun sea el jugador 1:
function actualizarClasesSegunJugador1() {

    // Buscar jugador con id 1
    const jugador1 = jugadores.find(j => j.id === 1);
    if (!jugador1) return console.error("No existe jugador con ID 1.");

    const clase1 = jugador1.claseBase.toLowerCase();

    // Definir asignaciones según la clase del jugador 1
    const asignaciones = {
        guerrero:  ["clerigo", "hechicero"],
        paladin:   ["guerrero", "hechicero"],
        clerigo:   ["guerrero", "hechicero"],
        hechicero: ["guerrero", "paladin"]
    };

    // Obtener qué clases deberían tener el jugador 2 y 3
    const clasesAsignadas = asignaciones[clase1];
    if (!clasesAsignadas) {
        console.error("Clase desconocida para jugador 1:", clase1);
        return;
    }

    // Jugadores 2 y 3
    const jugador2 = jugadores.find(j => j.id === 2);
    const jugador3 = jugadores.find(j => j.id === 3);

    if (!jugador2 || !jugador3) {
        console.error("Faltan jugadores 2 o 3.");
        return;
    }

    // Cambiar sus clases
    const nuevasClases = [jugador2, jugador3];

    nuevasClases.forEach((pj, i) => {

        pj.claseBase = clasesAsignadas[i];

        asignarImagenSegunClase(pj);
        
        // Determinar claseMostrar según sexo (como en crearPersonaje)
        const clase = clasesAsignadas[i];
        const femenino = pj.sexo?.toLowerCase() === "femenino";

        const clasesFlexibles = {
            guerrero: "Guerrera",
            hechicero: "Hechicera",
            paladin: "Paladina",
            clerigo: "Cleriga"
        };

        pj.claseMostrar = femenino && clasesFlexibles[clase]
            ? clasesFlexibles[clase]
            : clase.charAt(0).toUpperCase() + clase.slice(1);

    });

    console.log("=== Clases del jugador 2 y 3 actualizadas según jugador 1 ===");
    console.log(jugadores);
}

function asignarImagenSegunClase(personaje) {

    if (!personaje || !personaje.nombre || !personaje.claseBase) return;

    const clase = personaje.claseBase.toLowerCase();
    const nombre = personaje.nombre;

    // Clases con espada
    const usaEspada = ["guerrero", "paladin"];

    // Clases con báculo
    const usaBaculo = ["hechicero", "clerigo"];

    let arma = "Espada"; // default

    if (usaEspada.includes(clase)) {
        arma = "Espada";
    } else if (usaBaculo.includes(clase)) {
        arma = "Baculo";
    }

    // Construir ruta final
    personaje.img = `imgs/${nombre}${arma}.png`;
}

//--------------------------------------------------------------------------------------------------------------------------------

// ==========================================================
// ATAQUES QUE EXISTEN EN TOTAL
// ==========================================================
const ataquesDisponibles = [
    {
        ataqueNum: 1,
        nombre: "Ataque Básico",
        tipo: "Fisico",
        pmNecesaria: 0,
        precision: 100,
        detalle: "Ataca al enemigo que está a 1 casillero.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            cantidad: 3
        }
    },
    {
        ataqueNum: 2,
        nombre: "Mini Curación",
        tipo: "Curacion",
        pmNecesaria: 2,
        precision: 100,
        detalle: "Te cura un poco.",
        target: "Compañero",
        efecto: {
            tipo: "Curacion",
            cantidad: 4
        }
    },
    {
        ataqueNum: 3,
        nombre: "Palazo",
        tipo: "Fisico",
        pmNecesaria: 0,
        precision: 100,
        detalle: "Ataca al enemigo que está a 1 casillero.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            cantidad: 2
        }
    },
    {
        ataqueNum: 4,
        nombre: "Bola de Fuego",
        tipo: "Magia",
        pmNecesaria: 2,
        precision: 100,
        detalle: "Lanza una bola de fuego al enemigo.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            cantidad: 6
        }
    },
    {
        ataqueNum: 5,
        nombre: "Revivir",
        tipo: "Curacion",
        pmNecesaria: 5,
        precision: 50,
        detalle: "Revive a un aliado.",
        target: "Compañero",
        efecto: {
            tipo: "Revivir",
            cantidad: 20,   // Por ejemplo revive con +20 PV
            soloSiEstado: 2 // Se puede usar solo si el compañero esta muerto
        }
    },
    {
        ataqueNum: 6,
        nombre: "Bajar Defensa",
        tipo: "Conjuro",
        pmNecesaria: 2,
        precision: 80,
        detalle: "Le baja la defensa al enemigo.",
        target: "Rival",
        efecto: {
            tipo: "Debuff",
            stat: "defensa",
            porcentaje: 0.15,                            // -15%
            duracion: Math.floor(Math.random() * 2) + 2  // entre 2 y 3 turnos
        }
    },
    {
        ataqueNum: 7,
        nombre: "Envenenar",
        tipo: "Conjuro",
        pmNecesaria: 5,
        precision: 70,
        detalle: "Aplica el estado Envenenado.",
        target: "Rival",
        efecto: {
            tipo: "Estado",
            estadoId: 3,     // ← Envenenado
            duracion: 9999   // ← Eterno hasta que alguien lo cure
        }
    },
    {
        ataqueNum: 8,
        nombre: "Curar Veneno",
        tipo: "Curacion",
        pmNecesaria: 5,
        precision: 70,
        detalle: "Cura el estado Envenenado.",
        target: "Compañero",
        efecto: {
            tipo: "Estado",
            estadoId: 1,   // Lo vuelve a dejar Saludable
            soloSiEstado: 3 // Se puede usar solo si el compañero esta muerto
        }
    },
        {
        ataqueNum: 9,
        nombre: "Dardo Mágico",
        tipo: "Magia",
        pmNecesaria: 2,
        precision: 100,
        detalle: "Lanza una Dardo que hace un daño mínimo.",
        target: "Rival",
        efecto: {
            tipo: "Daño",
            cantidad: 3
        }
    },

];

// -------------------------------------------------------------------------------------------------------------------------------------

// ======================================================================
// FUNCIÓN PARA CREAR PERSONAJES
// ======================================================================
function crearPersonaje(datos) {

    // =========================================================
    // CLASE BASE
    // =========================================================
    let claseBase = datos.claseBase ?? datos.clase ?? "";
    claseBase = claseBase.toString().trim().toLowerCase();

    const clasesFlexibles = {
        guerrero: "Guerrera",
        hechicero: "Hechicera",
        paladin: "Paladina",
        clerigo: "Cleriga"
    };

    // =========================================================
    // CLASE MOSTRAR (versión femenina si corresponde)
    // =========================================================
    let claseMostrar = datos.claseMostrar ?? claseBase;
    if (!datos.claseMostrar && datos.sexo?.toLowerCase() === "femenino") {
        if (clasesFlexibles[claseBase]) {
            claseMostrar = clasesFlexibles[claseBase];
        }
    }

    // =========================================================
    // ICONOS (Muerto / Envenenado)
    // =========================================================
    const nombreLower = (datos.nombre ?? "").toLowerCase();
    const imgBase = `imgs/iconos/${nombreLower}Icono`;

    // =========================================================
    // SELECCIÓN AUTOMÁTICA DE IMAGEN SEGÚN CLASE
    // =========================================================

    let nombreImg = (datos.nombre ?? "").trim();

    if (nombreImg.length > 0) {
        nombreImg = nombreImg.charAt(0).toUpperCase() + nombreImg.slice(1);
    }

    // Determinar arma según clase
    let arma = "";

    if (claseBase === "guerrero" || claseBase === "paladin") {
        arma = "Espada";
    } else if (claseBase === "clerigo" || claseBase === "hechicero") {
        arma = "Baculo";
    }

    // Ruta automática: ej. "imgs/JaviEspada.png"
    let rutaAutomatica = `imgs/${nombreImg}${arma}.png`;

    // Regla final:
    // - Si datos.img está definido → usarlo
    // - Sino → usar ruta automática
    let imagenFinal = datos.img ?? rutaAutomatica;

    // =========================================================
    // RETORNO FINAL DEL OBJETO PERSONAJE
    // =========================================================

    return {
        sexo: datos.sexo,
        id: datos.id,
        nombre: datos.nombre,
        tipo: datos.tipo,

        claseBase: claseBase,
        claseMostrar: claseMostrar,
        nivel: datos.nivel ?? 1,

        pv: datos.pv,
        pvMax: datos.pvMax,
        pm: datos.pm,
        pmMax: datos.pmMax,

        fuerza: datos.fuerza,
        poderMagico: datos.poderMagico,
        defensa: datos.defensa,
        defensaMagica: datos.defensaMagica,
        velocidad: datos.velocidad,

        experiencia: datos.experiencia ?? 0,
        puntosDisponibles: datos.puntosDisponibles ?? 0,

        estado: datos.estado ?? 1,

        // Imagen automáticamente seleccionada
        img: imagenFinal,

        // Iconos
        imgIcono: `${imgBase}.png`,
        imgIconoMuerto: `${imgBase}Muerto.png`,
        imgIconoEnvenenado: `${imgBase}Envenenado.png`,

        ataques: datos.ataquesAprendidosNum
            ? datos.ataquesAprendidosNum.map(num =>
                ataquesDisponibles.find(a => a.ataqueNum === num)
            )
            : [],

        inventario: datos.inventario ?? [],
        armaEquipadx: datos.armaEquipadx ?? [],
        armaduraEquipadx: datos.armaduraEquipadx ?? [],
        escudoEquipadx: datos.escudoEquipadx ?? [],
        cascoEquipadx: datos.cascoEquipadx ?? [],
        accesorioEquipadx: datos.accesorioEquipadx ?? [],

        activo: datos.activo ?? false
    };
}

// ======================================================================
// LISTA DE PERSONAJES (JUGADORES)
// ======================================================================
const jugadores = [

    crearPersonaje({
        sexo: "Masculino",
        id: 1,
        nombre: "Javi",
        tipo: "jugador",
        clase: "Guerrero",
        nivel: 4,

        pv: 22,
        pvMax: 22,
        pm: 15,
        pmMax: 15,

        fuerza: 3,
        poderMagico: 0,
        defensa: 1,
        defensaMagica: 0,
        velocidad: 2,

        experiencia: 415,
        puntosDisponibles: 3,

        ataquesAprendidosNum: [1, 2, 5],
        inventario: [1, 1, 2, 6, 7, 4, 8],
        armaEquipadx: [],
        armaduraEquipadx: [],
        escudoEquipadx: [],
        cascoEquipadx: [],
        accesorioEquipadx: [],

        estado: 1
    }),

    crearPersonaje({
        sexo: "Masculino",
        id: 2,
        nombre: "Benja",
        tipo: "jugador",
        clase: "Hechicero",
        nivel: 1,

        pv: 12,
        pvMax: 12,
        pm: 20,
        pmMax: 20,

        fuerza: 2,
        poderMagico: 3,
        defensa: 0,
        defensaMagica: 1,
        velocidad: 1,

        experiencia: 0,
        puntosDisponibles: 0,

        ataquesAprendidosNum: [2],
        inventario: [2],
        armaEquipadx: [3],
        armaduraEquipadx: [4],
        escudoEquipadx: [],
        cascoEquipadx: [],
        accesorioEquipadx: [],

        estado: 1
    }),

    crearPersonaje({
        sexo: "Femenino",
        id: 3,
        nombre: "Jaz",
        tipo: "jugador",
        clase: "Hechicero",
        nivel: 1,

        pv: 20,
        pvMax: 20,
        pm: 15,
        pmMax: 15,

        fuerza: 1,
        poderMagico: 3,
        defensa: 0,
        defensaMagica: 1,
        velocidad: 1,

        experiencia: 0,
        puntosDisponibles: 0,

        ataquesAprendidosNum: [2, 5],
        inventario: [1, 1],
        armaEquipadx: [3],
        armaduraEquipadx: [],
        escudoEquipadx: [],
        cascoEquipadx: [],
        accesorioEquipadx: [],

        estado: 1
    })

];

// ======================================================================
// ENEMIGOS
// ======================================================================
function crearEnemigo(datos) {
    return {
        id: datos.id,
        nombre: datos.nombre,
        tipo: "enemigo",
        clase: datos.clase,
        nivel: datos.nivel,

        pv: datos.pv,
        pvMax: datos.pvMax,
        pm: datos.pm,
        pmMax: datos.pmMax,

        fuerza: datos.fuerza,
        poderMagico: datos.poderMagico,
        defensa: datos.defensa,
        defensaMagica: datos.defensaMagica,
        velocidad: datos.velocidad,

        img: datos.img,
        imgIcono: datos.imgIcono,
        imgIconoMuerto: datos.imgIconoMuerto,
        imgIconoEnvenenado: datos.imgIconoEnvenenado,

        ataques: datos.ataquesAprendidosNum
            ? datos.ataquesAprendidosNum.map(num =>
                ataquesDisponibles.find(a => a.ataqueNum === num)
            )
            : [],

        estado: datos.estado ?? 1
    };
}

const enemigos = [

    crearEnemigo({
        id: 1,
        nombre: "Goblin",
        clase: "guerrero",
        nivel: 1,
        pv: 8,
        pvMax: 8,
        pm: 0,
        pmMax: 0,
        fuerza: 2,
        poderMagico: 0,
        defensa: 1,
        defensaMagica: 0,
        velocidad: 1,
        img: "imgs/goblinPalo.png",
        imgIcono: "imgs/iconos/goblinIcono.png",
        ataquesAprendidosNum: [3]
    }),

    crearEnemigo({
        id: 2,
        nombre: "Goblin",
        clase: "guerrero",
        nivel: 2,
        pv: 11,
        pvMax: 11,
        pm: 0,
        pmMax: 0,
        fuerza: 2,
        poderMagico: 0,
        defensa: 2,
        defensaMagica: 0,
        velocidad: 2,
        img: "imgs/goblinPalo.png",
        imgIcono: "imgs/iconos/goblinIcono.png",
        ataquesAprendidosNum: [3]
    }),

    crearEnemigo({
        id: 3,
        nombre: "Bruja",
        clase: "hechicero",
        nivel: 1,
        pv: 8,
        pvMax: 8,
        pm: 15,
        pmMax: 15,
        fuerza: 1,
        poderMagico: 3,
        defensa: 0,
        defensaMagica: 1,
        velocidad: 2,
        img: "imgs/brujaNormal.png",
        imgIcono: "imgs/iconos/brujaNormalIcono.png",
        ataquesAprendidosNum: [1, 4, 6]
    })
];


// ======================================================================
// MARCAR JUGADORES ACTIVOS
// ======================================================================
jugadores[0].activo = true;
jugadores[1].activo = false;
jugadores[2].activo = false;

// -------------------------------------------------------------------------------------------------------------------------------------

// ======================================================================
// TABLA DE CRECIMIENTO REAL PARA TUS STATS
// ======================================================================
const crecimientoStats = {
    fuerza:        [0, 3, 3, 2, 2, 1, 3, 2, 2, 1, 3],
    defensa:       [0, 3, 1, 2, 1, 2, 1, 3, 1, 2, 1],
    poderMagico:   [0, 3, 3, 2, 2, 2, 3, 2, 1, 2, 2],
    defensaMagica: [0, 3, 1, 1, 2, 3, 2, 1, 3, 2, 1],
    velocidad:     [0, 3, 1, 1, 2, 1, 1, 2, 1, 1, 2]
};

// ======================================================================
// INICIALIZAR NIVELES DE STATS (todos comienzan en Nivel 1)
// ======================================================================
function inicializarNivelesDeStats(personaje) {
    personaje.nivelesStat = {
        fuerza: 1,
        defensa: 1,
        poderMagico: 1,
        defensaMagica: 1,
        velocidad: 1
    };
}

// Inicializar para todos los jugadores
jugadores.forEach(p => inicializarNivelesDeStats(p));

// ======================================================================
// FUNCIÓN PARA CALCULAR UNA STAT REAL SEGÚN SU NIVEL
// ======================================================================
function calcularStat(personaje, stat) {
    let base = personaje.statsBase[stat];
    let nivel = personaje.nivelesStat[stat];

    let total = base;
    for (let i = 2; i <= nivel; i++) {
        total += crecimientoStats[stat][i];
    }
    return total;
}

// ======================================================================
// TABLA DE AUMENTO PV/PM POR CLASE
// ======================================================================
const aumentoStatsPorNivel = {
    Guerrero:       { pv: 5, pm: 2 },
    Paladin:        { pv: 6, pm: 3 },
    Clerigo:        { pv: 4, pm: 4 },
    Hechicero:      { pv: 3, pm: 6 }
};

// ======================================================================
// APLICAR AUMENTO AL SUBIR NIVEL GENERAL
// ======================================================================
function aplicarAumentoPorNivel(personaje) {

    const clase = personaje.claseBase || personaje.clase;
    const aumento = aumentoStatsPorNivel[clase];

    if (!aumento) return personaje;

    personaje.pvMax += aumento.pv;
    personaje.pmMax += aumento.pm;

    personaje.pv = personaje.pvMax;
    personaje.pm = personaje.pmMax;

    return personaje;
}

// ======================================================================
// TABLA: PUNTOS de EXP. Necesarios para subir de Nivel (TU TABLA)
// ======================================================================
const experienciaNecesaria = {
    1: 0,
    2: 30,
    3: 90,
    4: 160,
    5: 240,
    6: 320,
    7: 410,
    8: 490,
    9: 590,
    10: 700
};

// ======================================================================
// TABLA: PUNTOS DE HABILIDAD POR SUBIR DE NIVEL (TU TABLA)
// ======================================================================
const puntosPorNivel = {
    1: 0,
    2: 2,
    3: 1,
    4: 2,
    5: 1,
    6: 3,
    7: 1,
    8: 2,
    9: 3,
    10: 2
};

// ======================================================================
// ESTADOS DEL JUGADOR
// ======================================================================
const estados = [
    { id: 1, nombre: "saludable" },
    { id: 2, nombre: "muerto" },
    { id: 3, nombre: "envenenado" },
    { id: 4, nombre: "paralizado" },
    { id: 5, nombre: "congelado" },
    { id: 6, nombre: "quemado" },
    { id: 7, nombre: "dormido" }
];

// IMPORTANTE
const datosJugador1 = JSON.parse(localStorage.getItem("jugadorCreado"));
if (datosJugador1) {
    actualizarJugador1ConDatosCreacion(datosJugador1);
}

// Buscar un estado por id
function obtenerEstadoPorId(id) {
    return estados.find(e => e.id === id)?.nombre ?? "desconocido";
}

// Obtener icono según estado
function obtenerIconoSegunEstado(personaje) {

    const estado = obtenerEstadoPorId(personaje.estado);
    const nombreLower = personaje.nombre.toLowerCase();
    const baseRuta = `imgs/iconos/${nombreLower}Icono`;

    switch (estado) {
        case "muerto":
            return `${baseRuta}Muerto.png`;
        case "envenenado":
            return `${baseRuta}Envenenado.png`;
        default:
            return `${baseRuta}.png`;
    }
}

// ======================================================================
// AÑADIR EXP Y SUBIR DE NIVEL (Sincroniza campos y actualiza UI)
// ======================================================================
function agregarExp(personaje, cantidad) {

    // Compatibilidad con campos legacy
    if (typeof personaje.exp !== "number") {
        personaje.exp = (typeof personaje.experiencia === "number") ? personaje.experiencia : 0;
    }
    if (typeof personaje.experiencia !== "number") {
        personaje.experiencia = personaje.exp;
    }

    // Agregar experiencia
    personaje.exp += cantidad;
    personaje.experiencia = personaje.exp;

    // Determinar índice del jugador (IMPORTANTE para mejorasTemp)
    const idx = jugadores.indexOf(personaje);

    // Subir niveles mientras corresponda
    while (
        (personaje.nivel ?? 1) < 10 &&
        personaje.exp >= experienciaNecesaria[(personaje.nivel ?? 1) + 1]
    ) {
        personaje.nivel = (personaje.nivel ?? 1) + 1;

        // Sonido cuando el personaje sube de nivel
        sonidoSubeDeNivel.play();

        // Puntos otorgados para este nivel
        const puntosGanados = puntosPorNivel[personaje.nivel] ?? 0;

        personaje.puntosDisponibles = (personaje.puntosDisponibles ?? 0) + puntosGanados;
        personaje.puntosHabilidad = (personaje.puntosHabilidad ?? 0) + puntosGanados;

        // SINCRONIZAR mejorasTemp (FIX PRINCIPAL)
        if (idx !== -1 && mejorasTemp[idx]) {
            mejorasTemp[idx].puntosHabilidad = personaje.puntosHabilidad;
        }

        // Aumentos por clase
        aplicarAumentoPorNivel(personaje);
    }

    // Aseguramos defaults
    personaje.experiencia = personaje.exp;
    personaje.puntosDisponibles = personaje.puntosDisponibles ?? 0;
    personaje.puntosHabilidad = personaje.puntosHabilidad ?? personaje.puntosDisponibles;


    // ============================
    // Actualizar UI
    // ============================

    if (typeof actualizarPaginaStatus === "function") {
        try { actualizarPaginaStatus(); } catch (e) {
            console.error("Error en actualizarPaginaStatus:", e);
        }
    } else {
        try { mostrarEstadisticasDelSeleccionado(); } catch (e) {}
    }

    if (typeof inicializarStatsExperiencia === "function") {
        try { inicializarStatsExperiencia(); } catch (e) {
            console.error("Error en inicializarStatsExperiencia:", e);
        }
    } else if (typeof actualizarPaginaMejoras === "function") {
        try { actualizarPaginaMejoras(); } catch (e) {
            console.error("Error en actualizarPaginaMejoras:", e);
        }
    } else {
        mostrarPuntosHabilidadesDelSeleccionado();
    }

    if (typeof refrescarPantallaStats === "function") {
        try { refrescarPantallaStats(); } catch (e) {
            console.error("Error en refrescarPantallaStats:", e);
        }
    }
}

// ======================================================================
// MOSTRAR ESTADÍSTICAS DEL JUGADOR SELECCIONADO (ROBUSTO)
// ======================================================================
// Esta función intenta actualizar los elementos más comunes del "Perfil".
// Si tenés funciones propias (refrescarPantallaStats, actualizarPaginaStatus), se usan preferentemente.
function mostrarEstadisticasDelSeleccionado() {

    if (typeof refrescarPantallaStats === "function") {
        try { refrescarPantallaStats(); return; } catch (e) {}
    }

    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    let jugador;

    if (tarjeta && tarjeta.dataset.jugadorIndex != null) {
        jugador = jugadores[parseInt(tarjeta.dataset.jugadorIndex, 10)];
    } else {
        jugador = jugadores[0];
    }

    if (!jugador) return;

    const campos = [
        { sel: "#nivelJugador", campo: "nivel" },
        { sel: ".nivelJugador", campo: "nivel" },
        { sel: "#expJugador", campo: "exp" },
        { sel: ".expJugador", campo: "exp" },
        { sel: "#pvJugador", campo: "pv" },
        { sel: "#pvMaxJugador", campo: "pvMax" },
        { sel: "#pmJugador", campo: "pm" },
        { sel: "#pmMaxJugador", campo: "pmMax" },
        { sel: "#nombreJugador", campo: "nombre" },
        { sel: ".nombreJugador", campo: "nombre" },
        { sel: "#puntosDisponibles", campo: "puntosDisponibles" },
        { sel: ".puntosDisponibles", campo: "puntosDisponibles" }
    ];

    campos.forEach(p => {
        const el = document.querySelector(p.sel);
        if (!el) return;
        const val = jugador[p.campo] ?? jugador[p.campo === "exp" ? "experiencia" : p.campo];
        el.textContent = val != null ? String(val) : "";
    });

    const expElem = document.querySelector("#mostrarExpTotal") || document.querySelector(".mostrarExpTotal");
    if (expElem) expElem.textContent = `EXP: ${jugador.exp ?? jugador.experiencia ?? 0}`;

    mostrarPuntosHabilidadesDelSeleccionado();
}

// ======================================================================
// MOSTRAR PUNTOS HABILIDADES DEL SELECCIONADO — CORREGIDO
// ======================================================================
if (typeof mostrarPuntosHabilidadesDelSeleccionado !== "function") {

    function mostrarPuntosHabilidadesDelSeleccionado() {

        const tarjeta = document.querySelector(".cartaJugador.seleccionada");
        if (!tarjeta) return;

        const idx = parseInt(tarjeta.dataset.jugadorIndex, 10);
        const jugador = jugadores[idx];
        const temp = mejorasTemp[idx];

        const divPuntos = document.getElementById("mostrarPuntosDisponibles");
        if (!divPuntos) return;

        // ✔️ Ahora SIEMPRE se prioriza el valor real del personaje
        // y temp solo lo refleja si existe.
        const puntos = jugador.puntosHabilidad ?? jugador.puntosDisponibles ?? 0;

        divPuntos.textContent = `Puntos Disponibles: ${puntos}`;

        // Sincronizar temporal
        if (temp) temp.puntosHabilidad = puntos;
    }
}

// ======================================================================
// AJUSTE: inicializarStatsExperiencia asegura maxNivel
// ======================================================================
if (typeof inicializarStatsExperiencia === "function") {
    const _origInicializar = inicializarStatsExperiencia;
    inicializarStatsExperiencia = function() {
        window.maxNivel = window.maxNivel ?? 10;
        try { return _origInicializar(); } catch (e) {}
    };
}

// ======================================================================
// SUBIR UNA STAT
// ======================================================================
function subirStat(personaje, stat) {

    if (personaje.puntosDisponibles <= 0) {
        console.warn("No quedan puntos de stat.");
        return;
    }

    const nivelActual = personaje.nivelesStat[stat];
    if (nivelActual >= 10) {
        console.warn("Stat ya al máximo.");
        return;
    }

    personaje.nivelesStat[stat]++;

    personaje[stat] = calcularStat(personaje, stat);

    personaje.puntosDisponibles--;
}

// ======================================================================
// CALCULAR CUÁNTO TENDRÁ SI SUBE LA STAT
// ======================================================================
function valorSiSube(personaje, stat) {

    const nivelActual = personaje.nivelesStat[stat];
    if (nivelActual >= 10) return personaje[stat];

    const nivelNuevo = nivelActual + 1;

    let base = personaje.statsBase[stat];
    let total = base;

    for (let i = 2; i <= nivelNuevo; i++) {
        total += crecimientoStats[stat][i];
    }

    return total;
}

//------------------------------------------------------------------------------------------------------

// ==========================================================
// ITEMS
// ==========================================================
const items = [
    {
        itemId: 1,
        nombre: "Hierba Curativa",
        tipo: "ItemBatalla",
        slot: null,
        sexo: "Ambos",
        efecto: { tipo: "CurarPV", cantidad: 4 },
        detalle: "Te cura un poco.",
        target: "Compañero",
        precioCompra: 10,
        precioVenta: 7,
        clase: "Todos",
        img: "imgs/items/hierbaCurativaP.png"
    },
    {
        itemId: 2,
        nombre: "Espada Basica",
        tipo: "Equipamiento",
        slot: "arma",
        sexo: "Ambos",
        efecto: { fuerza: [1, 3] },
        detalle: "Te la prestó el Mercader del Pueblo",
        precioCompra: 10,
        precioVenta: 7,
        clase: ["guerrero", "paladin"],
        img: "imgs/items/arma/espadaBasica.png"
    },
    {
        itemId: 3,
        nombre: "Báculo Principiante",
        tipo: "Equipamiento",
        slot: "arma",
        sexo: "Ambos",
        efecto: { poderMagico: 1 },
        detalle: "Entregado a los recibidos en la Escuela de Magia.",
        precioCompra: 12,
        precioVenta: 8,
        clase: ["hechicero", "clerigo"],
        img: "imgs/items/arma/baculoPrincipiante.png"
    },
    {
        itemId: 4,
        nombre: "Ropa de Campesino",
        tipo: "Equipamiento",
        slot: "armadura",
        sexo: "Ambos",
        efecto: { defensa: 1 },
        detalle: "Protege ligeramente contra ataques físicos.",
        precioCompra: 15,
        precioVenta: 10,
        clase: "Todos",
        img: "imgs/items/armadura/ropaCampesino.png"
    },
    {
        itemId: 5,
        nombre: "Poción de Mana Pequeña",
        tipo: "ItemBatalla",
        slot: null,
        sexo: "Ambos",
        efecto: { tipo: "CurarPM", cantidad: 4 },
        detalle: "Te restaura un poco de PM",
        target: "Compañero",
        precioCompra: 10,
        precioVenta: 7,
        clase: "Todos",
        img: "imgs/items/pocionManaP.png"
    },
    {
        itemId: 6,
        nombre: "Bandana",
        tipo: "Equipamiento",
        slot: "casco",
        sexo: "Ambos", // Tambien existen "Masculino" y "Femenino". "Ambos" es para ambos sexos.
        efecto: { defensa: 1 },
        detalle: "Protege ligeramente contra ataques físicos.",
        precioCompra: 10,
        precioVenta: 7,
        clase: "Todos", // Tambien existen "Hechicero" y "Guerrero". "Todos" es para ambas clases.
        img: "imgs/items/casco/bandana.png"
    },
        {
        itemId: 7,
        nombre: "Tapa de Barril",
        tipo: "Equipamiento",
        slot: "escudo",
        sexo: "Ambos",
        efecto: { defensa: 1 },
        detalle: "Protege ligeramente contra ataques físicos.",
        precioCompra: 10,
        precioVenta: 7,
        clase: "Guerrero",
        img: "imgs/items/escudo/escudoTapa.png"
    },
        {
        itemId: 8,
        nombre: "Espada Buena",
        tipo: "Equipamiento",
        slot: "arma",
        sexo: "Ambos",
        efecto: { fuerza: [3, 5] },
        detalle: "Hecha por los Herreros del Pueblo",
        precioCompra: 13,
        precioVenta: 9,
        clase: "Guerrero",
        img: "imgs/items/arma/espadaBuena.png"
    }
];

// ==============================================
// Función segura PARA OBTENER UN ITEM por ID
// ==============================================
function getItemById(id) {
    return items.find(obj => obj.itemId === id);
}

// ==========================================================
// FILTRA los items equipables según el slot
// ==========================================================
function filtrarItemsEquipables(jugador, slot) {

    // Clase base del jugador para filtros (siempre minúscula)
    const claseJugador = (jugador.claseBase || jugador.clase || "")
        .toString()
        .trim()
        .toLowerCase();

    // Sexo del jugador para filtros
    const sexoJugador = (jugador.sexo || "")
        .toString()
        .trim()
        .toLowerCase();

    // Asegurarse que el inventario sea un array
    const inventario = Array.isArray(jugador.inventario) ? jugador.inventario : [];

    return inventario
        .map(id => getItemById(id))
        .filter(item => item) // filtrar undefined/null

        // Solo equipamiento
        .filter(item =>
            (item.tipo || "").toString().trim().toLowerCase() === "equipamiento"
        )

        // Solo el slot indicado
        .filter(item =>
            (item.slot || "").toString().trim().toLowerCase() ===
            (slot || "").toString().trim().toLowerCase()
        )

        // Filtrar por clase
        .filter(item => {
            let clasesItem = item.clase;

            // Si no tiene clase, equipable por defecto
            if (!clasesItem) return true;

            // Convertir string a array si es necesario
            if (!Array.isArray(clasesItem)) clasesItem = [clasesItem];

            // Normalizar todas las clases del item
            clasesItem = clasesItem.map(c => (c ?? "").toString().trim().toLowerCase());

            // Comodines
            if (clasesItem.includes("todos") || clasesItem.includes("ambos")) return true;

            // Comparar con claseBase
            return clasesItem.includes(claseJugador);
        })

        // Filtrar por sexo
        .filter(item => {
            let sexoItem = (item.sexo || "").toString().trim().toLowerCase();
            if (!sexoItem || sexoItem === "ambos" || sexoItem === "todos") return true;
            return sexoItem === sexoJugador;
        });
}


// -------------------------------------------------------------------------------------------------------------------------------------

// ==========================================================
// SONIDOS DEL JUEGO
// ==========================================================
const sonidoCurar = new Audio("sonidos/item_curacion_wav.wav");
const sonidoRevivirFallido = new Audio("sonidos/revivir_fallido_wav.wav");
const sonidoRevivirExitoso = new Audio ("sonidos/revivir_exitoso_wav.wav")
const sonidoSubeDeNivel = new Audio("sonidos/sube_de_nivel_wav.wav");

// -------------------------------------------------------------------------------------------------------------------------------------

// ==========================================================
// BOTONES ENTRE PAGINAS
// ==========================================================

const paginaPrincipal = document.getElementById("paginaPrincipal");
const paginaStatus = document.getElementById("paginaStatus");
const paginaFormacion = document.getElementById("paginaFormacion");
const paginaTablero = document.getElementById("paginaTablero");

const btnPaginaStatus = document.getElementById("btnPaginaStatus");
const btnPaginaFormacion = document.getElementById("btnPaginaFormacion");
const btnPaginaTablero = document.getElementById("btnPaginaTablero");

const btnCerrarPaginaStatus = document.getElementById("btnCerrarPaginaStatus");
const btnConfirmarFormacion = document.getElementById("btnConfirmarFormacion");
const btnHuir = document.getElementById("btnHuir");

// Abro y Cierro la pagina Status
btnPaginaStatus.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaStatus.style.display = "block";

    actualizarPaginaStatus(); // Esta funcion esta mas abajo.
});

btnCerrarPaginaStatus.addEventListener("click", () => {
    paginaStatus.style.display = "none";
    paginaPrincipal.style.display = "block";
});

// Abro y Cierro la pagina Formacion
btnPaginaFormacion.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaFormacion.style.display = "block";

    crearTableroFormacion();
});

btnConfirmarFormacion.addEventListener("click", () => {
    jugadorSeleccionado = null;
    document.querySelectorAll("#tablaFormacion img").forEach(img => {
        img.style.filter = "none";
    });

    paginaFormacion.style.display = "none";
    paginaPrincipal.style.display = "block";
});

// Abro y Cierro la pagina Tablero
btnPaginaTablero.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaTablero.style.display = "block";
    iniciarTablero();
    iniciarPelea();
});

btnHuir.addEventListener("click", () => {
    if (confirm("¿Desea huir del combate?")) {
        paginaTablero.style.display = "none";
        paginaPrincipal.style.display = "block";
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------

// =====================================================
// Funcion RESETEAR SOLAPAS: Que te posiciona directamente en la Carta del jugador 1, y en la pagina Atributos
// =====================================================

function resetearSolapas() {
    document.querySelectorAll(".solapa").forEach(b =>
        b.classList.remove("activa")
    );

    const btnCaract = document.querySelector('.solapa[data-tab="caract"]');
    btnCaract.classList.add("activa");

    // Mostrar panel Características
    document.getElementById("tabCaract").style.display = "flex";
    document.getElementById("tabObjetos").style.display = "none";
    document.getElementById("tabHechizos").style.display = "none";
    document.getElementById("tabExperiencia").style.display = "none";

    document.getElementById("divDerechoCaract").style.display = "flex";
    document.getElementById("divDerechoObjetos").style.display = "none";
    document.getElementById("divDerechoHechizos").style.display = "none";
    document.getElementById("divDerechoExperiencia").style.display = "none";
}

// =====================================================
// SISTEMA DE SOLAPAS
// =====================================================

function inicializarSolapasStatus() {

    const btnCaract = document.querySelector('.solapa[data-tab="caract"]');
    const btnObjetos = document.querySelector('.solapa[data-tab="objetos"]');
    const btnHechizos = document.querySelector('.solapa[data-tab="hechizos"]');

    const tabCaract = document.getElementById("tabCaract");
    const tabObjetos = document.getElementById("tabObjetos");
    const tabHechizos = document.getElementById("tabHechizos");

    // ------------------------------------
    // CARACTERÍSTICAS
    // ------------------------------------
    btnCaract.addEventListener("click", () => {

        resetearSolapas();

        tabCaract.style.display = "flex";
        tabObjetos.style.display = "none";
        tabHechizos.style.display = "none";
        tabExperiencia.style.display = "none";

        document.getElementById("divDerechoCaract").style.display = "flex";
        document.getElementById("divDerechoObjetos").style.display = "none";
        document.getElementById("divDerechoHechizos").style.display = "none";
        document.getElementById("divDerechoExperiencia").style.display = "none";

        mostrarEquipamientoDelSeleccionado(); // Actualiza en tiempo real el item que aparece en los slots
        mostrarEstadisticasDelSeleccionado(); // Actualiza en tiempo real la estadistica si hay un item equipado
    });

    // ------------------------------------
    // OBJETOS
    // ------------------------------------
    btnObjetos.addEventListener("click", () => {

        document.querySelectorAll(".solapa").forEach(b => b.classList.remove("activa"));
        btnObjetos.classList.add("activa");

        tabCaract.style.display = "none";
        tabObjetos.style.display = "flex";
        tabHechizos.style.display = "none";
        tabExperiencia.style.display = "none";

        document.getElementById("divDerechoCaract").style.display = "none";
        document.getElementById("divDerechoObjetos").style.display = "flex";
        document.getElementById("divDerechoHechizos").style.display = "none";
        document.getElementById("divDerechoExperiencia").style.display = "none";

        actualizarInventarioSegunSeleccion();
    });

    // ------------------------------------
    // HECHIZOS
    // ------------------------------------
    btnHechizos.addEventListener("click", () => {

        document.querySelectorAll(".solapa").forEach(b => b.classList.remove("activa"));
        btnHechizos.classList.add("activa");

        tabCaract.style.display = "none";
        tabObjetos.style.display = "none";
        tabHechizos.style.display = "flex";
        tabExperiencia.style.display = "none";

        document.getElementById("divDerechoCaract").style.display = "none";
        document.getElementById("divDerechoObjetos").style.display = "none";
        document.getElementById("divDerechoHechizos").style.display = "flex";
        document.getElementById("divDerechoExperiencia").style.display = "none";

        actualizarHechizosSegunSeleccion();
    });

    // ------------------------------------
    // EXPERIENCIA
    // ------------------------------------
    const btnExperiencia = document.querySelector('.solapa[data-tab="experiencia"]');

    btnExperiencia.addEventListener("click", () => {

        document.querySelectorAll(".solapa").forEach(b => b.classList.remove("activa"));
        btnExperiencia.classList.add("activa");

        tabCaract.style.display = "none";
        tabObjetos.style.display = "none";
        tabHechizos.style.display = "none";
        tabExperiencia.style.display = "flex";

        document.getElementById("divDerechoCaract").style.display = "none";
        document.getElementById("divDerechoObjetos").style.display = "none";
        document.getElementById("divDerechoHechizos").style.display = "none";
        document.getElementById("divDerechoExperiencia").style.display = "flex";

        inicializarStatsExperiencia(); // función para inicializar botones +/-, valores y puntos disponibles
    });

}

// =====================================================
// DISEÑO DE LA CARTA JUGADOR (Su imagen de perfil, su barra VIDA y su barra MANA)
// La actualiza en TIEMPO REAL
// =====================================================

function actualizarPaginaStatus() {

    resetearSolapas();

    const divsStatus = [
        document.getElementById("statusJugador1"),
        document.getElementById("statusJugador2"),
        document.getElementById("statusJugador3")
    ];

    const infoEstadisticas = document.getElementById("infoEstadisticas");

    divsStatus.forEach(div => {
        div.innerHTML = "";
        div.style.display = "none";
    });
    infoEstadisticas.innerHTML = "";

    let primerJugadorActivoIndex = null;

    jugadores.forEach((jugador, index) => {
        if (!jugador.activo) return;

        if (primerJugadorActivoIndex === null)
            primerJugadorActivoIndex = index;

        const div = divsStatus[index];
        div.style.display = "block";

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("cartaJugador");
        tarjeta.dataset.jugadorIndex = index;

        // Cambiado el <img> para que use obtenerIconoSegunEstado(jugador)
        tarjeta.innerHTML = `
            <div class="iconoJugador">
                <img class="iconoJugadorIMG" src="${obtenerIconoSegunEstado(jugador)}">
            </div>

            <div class="infoCartaJugador">

                <div class="filaNombreNivel">
                    <span class="nombreJugador">${jugador.nombre}</span>
                    <span class="nivelJugador">Nivel ${jugador.nivel}</span>
                </div>

                <div class="lineaStatus">
                    <span class="labelStatus">PV ${jugador.pv}/${jugador.pvMax}</span>
                    <div class="barraContenedor">
                        <div class="barraVida" style="width:${(jugador.pv / jugador.pvMax) * 100}%"></div>
                    </div>
                </div>

                <div class="lineaStatus">
                    <span class="labelStatus">PM ${jugador.pm}/${jugador.pmMax}</span>
                    <div class="barraContenedor">
                        <div class="barraMana" style="width:${(jugador.pm / jugador.pmMax) * 100}%"></div>
                    </div>
                </div>

            </div>
        `;

        div.appendChild(tarjeta);

        tarjeta.addEventListener("click", () =>
            seleccionarTarjeta(jugador, tarjeta)
        );
    });

    if (primerJugadorActivoIndex !== null) {
        const primeraTarjeta =
            divsStatus[primerJugadorActivoIndex].querySelector(".cartaJugador");

        if (primeraTarjeta)
            seleccionarTarjeta(jugadores[primerJugadorActivoIndex], primeraTarjeta);
    }

    inicializarSolapasStatus();
    inicializarPopupEquipamiento();
}

// ------------------------------------------------------------------------------------------------------------------------

// ======================
// FUNCIONES TOOLTIP
// ======================
function crearTooltip(nombreItem) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = nombreItem;
    document.body.appendChild(tooltip);
    return tooltip;
}

function moverTooltip(tooltip, event) {
    tooltip.style.left = `${event.pageX}px`;
    tooltip.style.top = `${event.pageY - 10}px`;
}

function mostrarTooltip(tooltip) {
    tooltip.style.opacity = "1";
}

function ocultarTooltip(tooltip) {
    tooltip.style.opacity = "0";
    setTimeout(() => tooltip.remove(), 150);
}

// =====================================================
// ITEMS EQUIPADOS (Solapa Habilidades)
// =====================================================

function mostrarEquipamientoDelSeleccionado() {

    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugador = jugadores[tarjeta.dataset.jugadorIndex];
    const slots = ["arma", "armadura", "escudo", "casco", "accesorio"];

    // -----------------------------------------
    // REUTILIZAR / CREAR TOOLTIP GLOBAL
    // -----------------------------------------
    let tooltipGlobal = document.querySelector("#tooltipEquipamientoGlobal");
    if (!tooltipGlobal) {
        tooltipGlobal = document.createElement("div");
        tooltipGlobal.id = "tooltipEquipamientoGlobal";
        tooltipGlobal.className = "tooltip";
        tooltipGlobal.style.position = "fixed";
        tooltipGlobal.style.transform = "translate(0,0)";
        tooltipGlobal.style.opacity = "0";
        tooltipGlobal.style.pointerEvents = "none";
        document.body.appendChild(tooltipGlobal);
    }

    // -----------------------------------------
    // LIMPIA CAJITAS
    // -----------------------------------------
    slots.forEach(slot => {
        const id = `cajita${capitalize(slot)}Equipada`;
        const oldDiv = document.getElementById(id);
        if (!oldDiv) return;

        const nueva = oldDiv.cloneNode(false);
        nueva.id = id;
        nueva.className = oldDiv.className;
        nueva.innerHTML = capitalize(slot);
        nueva.style.backgroundImage = "none";
        nueva.style.cursor = "pointer";
        nueva.style.filter = "brightness(1)";

        oldDiv.parentNode.replaceChild(nueva, oldDiv);
    });

    // -----------------------------------------
    // ASIGNAR CONTENIDO + LISTENERS
    // -----------------------------------------
    slots.forEach(slot => {

        const id = `cajita${capitalize(slot)}Equipada`;
        const divCajita = document.getElementById(id);
        if (!divCajita) return;

        const arrayEquipado = jugador[`${slot}Equipadx`];

        // CAJA VACÍA
        if (!arrayEquipado || arrayEquipado.length === 0) {

            divCajita.addEventListener("mouseenter", () => {
                divCajita.style.filter = "brightness(1.3)";
            });

            divCajita.addEventListener("mouseleave", () => {
                divCajita.style.filter = "brightness(1)";
            });

            divCajita.addEventListener("click", () => {
                abrirPopupEquipamiento(jugador, slot, null);
            });

            return;
        }

        // CAJA CON ITEM EQUIPADO
        const itemId = arrayEquipado[0];
        const item = items.find(i => i.itemId === itemId);

        if (!item) {
            divCajita.textContent = "Sin nada equipado";
            return;
        }

        // Imagen del ítem
        divCajita.innerHTML = "";
        divCajita.style.backgroundImage = `url('${item.img}')`;
        divCajita.style.backgroundSize = "cover";
        divCajita.style.backgroundPosition = "center";

        // Hover visual
        divCajita.addEventListener("mouseenter", () => {
            divCajita.style.filter = "brightness(1.3)";
        });

        divCajita.addEventListener("mouseleave", () => {
            divCajita.style.filter = "brightness(1)";
        });

        // Click → abrir popup
        divCajita.addEventListener("click", () => {
            abrirPopupEquipamiento(jugador, slot, item);
        });

        // -----------------------------------------
        // TOOLTIP — A LA DERECHA DEL CURSOR
        // -----------------------------------------
        divCajita.addEventListener("mouseenter", e => {
            tooltipGlobal.textContent = item.nombre;
            tooltipGlobal.style.opacity = "1";

            colocarTooltipDerecha(tooltipGlobal, e);
        });

        divCajita.addEventListener("mousemove", e => {
            colocarTooltipDerecha(tooltipGlobal, e);
        });

        divCajita.addEventListener("mouseleave", () => {
            tooltipGlobal.style.opacity = "0";
        });

    });
}

// FUNCIÓN AUXILIAR: POSICIONA TOOLTIP A LA DERECHA
function colocarTooltipDerecha(tooltip, e) {
    const offsetX = 18;
    const offsetY = 12;

    let left = e.clientX + offsetX;
    let top = e.clientY + offsetY;

    const rect = tooltip.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // evitar que salga por derecha
    if (left + rect.width + 8 > vw) {
        left = vw - rect.width - 8;
    }
    // evitar que salga por abajo
    if (top + rect.height + 8 > vh) {
        top = vh - rect.height - 8;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// =====================================================
// POPUP DE ITEMS EQUIPADOS (Solapa Perfil)
// =====================================================

function abrirPopupEquipamiento(jugador, slot, item) {

    const fondo = document.getElementById("popupFondoHabilidades");
    const ventana = document.getElementById("popupVentanaHabilidades");
    const btnDesequipar = document.getElementById("popupDesequiparHab");
    const btnTraspasar = document.getElementById("popupTraspasarHab");
    const contExtra = document.getElementById("popupExtraHab");
    const btnTirar = document.getElementById("popupTirarHab");
    const btnCerrar = document.getElementById("popupCerrarHab");

    if (!fondo || !ventana) return;

    // ---------- helpers ----------
    function safeShow(el) { if (el) el.style.display = "block"; }
    function safeHide(el) { if (el) el.style.display = "none"; }
    function clearHandler(el) { if (el) el.onclick = null; }

    function agregarAlUltimoLugar(jug, itemId) {
        if (!Array.isArray(jug.inventario)) jug.inventario = [];

        let ultimoLibre = -1;
        for (let i = 0; i < jug.inventario.length; i++) {
            if (jug.inventario[i] === undefined) ultimoLibre = i;
        }

        if (ultimoLibre !== -1) jug.inventario[ultimoLibre] = itemId;
        else jug.inventario.push(itemId);
    }

    function inventarioLleno(jug) {
        return Array.isArray(jug.inventario) && jug.inventario.filter(i => i !== undefined).length >= 15;
    }

    // ---------- NUEVO: FORMATOS DEL HEADER ----------
    function formatearEfectos(efectoObj) {
        const partes = [];

        for (const tipo in efectoObj) {
            const val = efectoObj[tipo];

            const mayus = tipo.toUpperCase();

            if (Array.isArray(val)) {
                partes.push(`${mayus} +${val[0]}/+${val[1]}`);
            } else {
                partes.push(`${mayus} +${val}`);
            }
        }
        return partes.join(" | ");
    }

    function construirHeader(item) {
        const div = document.createElement("div");
        div.style.textAlign = "center";
        div.style.marginBottom = "8px";

        const nombre = document.createElement("div");
        nombre.innerHTML = `<strong>${item.nombre}</strong>`;

        const efectos = document.createElement("div");
        efectos.textContent = formatearEfectos(item.efecto);
        efectos.style.marginTop = "3px";

        const detalle = document.createElement("div");
        detalle.innerHTML = `<em>"${item.detalle}"</em>`;
        detalle.style.marginTop = "3px";

        const hr = document.createElement("hr");
        hr.style.marginTop = "8px";

        div.appendChild(nombre);
        div.appendChild(efectos);
        div.appendChild(detalle);
        div.appendChild(hr);

        return div;
    }

    function construirLineaDivisoria() {
        const hr = document.createElement("hr");
        hr.style.margin = "8px 0";
        return hr;
    }

    // ---------- reset visual / handlers ----------
    if (contExtra) { contExtra.innerHTML = ""; contExtra.style.display = "none"; }

    const prevMsg = ventana.querySelector("#popupMensajeHab");
    if (prevMsg) prevMsg.remove();

    // borrar headers anteriores
    const oldHeader = ventana.querySelector(".popupHeaderItem");
    if (oldHeader) oldHeader.remove();

    safeShow(btnDesequipar);
    safeShow(btnTraspasar);
    safeShow(btnTirar);
    safeShow(btnCerrar);

    clearHandler(btnDesequipar);
    clearHandler(btnTraspasar);
    clearHandler(btnTirar);
    clearHandler(btnCerrar);
    fondo.onclick = null;

    const slotArray = `${slot}Equipadx`;

    // -------------------------------------------------
    // Filtrar compañeros activos de antemano
    // -------------------------------------------------
    const otrosGlobal = jugadores.filter(j => j !== jugador && j.activo);

    if (otrosGlobal.length === 0) safeHide(btnTraspasar);

    // =====================================================
    // SLOT VACÍO → MOSTRAR ITEMS EQUIPABLES DEL INVENTARIO
    // =====================================================
    if (!item) {

        // Ocultar botones no aplicables
        safeHide(btnDesequipar);
        safeHide(btnTraspasar);
        safeHide(btnTirar);

        contExtra.innerHTML = "";
        contExtra.style.display = "block";

        let lista = [];
        if (typeof filtrarItemsEquipables === "function") {
            lista = filtrarItemsEquipables(jugador, slot) || [];
        } else {
            lista = (Array.isArray(jugador.inventario) ? jugador.inventario.slice() : [])
                .map(id => items.find(it => it.itemId === id))
                .filter(it => it);
        }

        if (lista.length === 0) {
            const msg = document.createElement("div");
            msg.id = "popupMensajeHab_no_click";
            msg.textContent = "No tienes items equipables para este casillero.";
            msg.style.cursor = "default";
            msg.style.margin = "6px 0";

            contExtra.appendChild(msg);
            
            // línea abajo
            contExtra.appendChild(construirLineaDivisoria(true));

        } else {

            // ============ BLOQUE CON INFO DE CADA ITEM ============
            lista.forEach(it => {

                const bloque = document.createElement("div");
                bloque.style.padding = "6px";
                bloque.style.marginBottom = "6px";
                bloque.style.borderRadius = "6px";
                bloque.style.cursor = "pointer";
                bloque.style.background = "#eee";
                bloque.style.transition = "0.2s";

                bloque.onmouseenter = () => bloque.style.background = "#ddd";
                bloque.onmouseleave = () => bloque.style.background = "#eee";

                // Nombre
                const nombre = document.createElement("div");
                nombre.innerHTML = `<strong>${it.nombre}</strong>`;
                nombre.style.marginBottom = "4px";

                // Efectos detallados
                const efectos = document.createElement("div");
                efectos.style.fontSize = "0.9em";
                efectos.style.marginLeft = "8px";

                let listaEfectos = [];
                for (const tipo in it.efecto) {
                    const val = it.efecto[tipo];
                    const mayus = tipo.toUpperCase();

                    if (Array.isArray(val)) {
                        listaEfectos.push(`${mayus} +${val[0]}/+${val[1]}`);
                    } else {
                        listaEfectos.push(`${mayus} +${val}`);
                    }
                }

                efectos.textContent = listaEfectos.join(" | ");

                bloque.appendChild(nombre);
                bloque.appendChild(efectos);

                // OnClick: EQUIPAR
                bloque.onclick = () => {

                    if (Array.isArray(jugador[slotArray]) && jugador[slotArray].length > 0) {
                        const viejo = jugador[slotArray][0];
                        agregarAlUltimoLugar(jugador, viejo);
                    }

                    jugador[slotArray] = [it.itemId];

                    const idx = jugador.inventario.indexOf(it.itemId);
                    if (idx !== -1) jugador.inventario[idx] = undefined;
                    if (typeof compactarInventario === "function") compactarInventario(jugador);

                    cerrarPopupEquipamiento();
                    mostrarEquipamientoDelSeleccionado();
                    mostrarEstadisticasDelSeleccionado();

                    const solapa = document.querySelector(".solapa.activa")?.dataset?.tab;
                    if (solapa === "objetos") actualizarInventarioSegunSeleccion();
                };

                contExtra.appendChild(bloque);

                // divisoria debajo — AHORA MÁS FINA
                contExtra.appendChild(construirLineaDivisoria(true));
            });
        }

        btnCerrar.onclick = () => cerrarPopupEquipamiento();
        fondo.onclick = e => { if (e.target === fondo) cerrarPopupEquipamiento(); };

        fondo.style.display = "flex";
        return;
    }

    // =====================================================
    // DESDE AQUÍ → ITEM EQUIPADO
    // =====================================================

    // ---------- insertar HEADER DEL ITEM ----------
    const header = construirHeader(item);
    header.classList.add("popupHeaderItem");
    ventana.prepend(header);

    const itemId = item.itemId;

    // -------------------------------------------------
    // DESEQUIPAR
    // -------------------------------------------------
    if (btnDesequipar) {
        if (inventarioLleno(jugador)) {
            btnDesequipar.innerHTML = `Desequipar<br>(Inventario lleno)`;
            btnDesequipar.style.color = "red";
            btnDesequipar.style.cursor = "default";
            btnDesequipar.onclick = e => {
                e.preventDefault(); e.stopPropagation();
            };

        } else {
            btnDesequipar.style.color = "";
            btnDesequipar.style.cursor = "pointer";
            btnDesequipar.textContent = "Desequipar";

            btnDesequipar.onclick = () => {
                if (jugador[slotArray] && jugador[slotArray][0] === itemId) {

                    if (typeof compactarInventario === "function") compactarInventario(jugador);

                    jugador[slotArray] = [];
                    agregarAlUltimoLugar(jugador, itemId);
                }

                cerrarPopupEquipamiento();
                mostrarEquipamientoDelSeleccionado();
                mostrarEstadisticasDelSeleccionado();
                const solapa = document.querySelector(".solapa.activa")?.dataset?.tab;
                if (solapa === "objetos") actualizarInventarioSegunSeleccion();
            };
        }
    }

    // -------------------------------------------------
    // TRASPASAR
    // -------------------------------------------------
    if (btnTraspasar && otrosGlobal.length > 0) {

        btnTraspasar.onclick = () => {

            safeHide(btnDesequipar);
            safeHide(btnTraspasar);
            safeHide(btnTirar);
            safeHide(btnCerrar);

            contExtra.innerHTML = "";
            contExtra.style.display = "block";

            otrosGlobal.forEach(dest => {

                const div = document.createElement("div");
                div.classList.add("popupOpcionHab");

                if (inventarioLleno(dest)) {
                    div.innerHTML = `Traspasar a ${dest.nombre}<br>(Inventario lleno)`;
                    div.style.color = "red";
                    div.style.cursor = "default";
                    div.onclick = e => { e.preventDefault(); };
                } else {
                    div.textContent = `Traspasar a ${dest.nombre}`;
                    div.style.cursor = "pointer";

                    div.onclick = () => {

                        if (typeof compactarInventario === "function") compactarInventario(jugador);
                        if (typeof compactarInventario === "function") compactarInventario(dest);

                        if (jugador[slotArray] && jugador[slotArray][0] === itemId) {
                            jugador[slotArray] = [];
                        }

                        agregarAlUltimoLugar(dest, itemId);

                        cerrarPopupEquipamiento();
                        mostrarEquipamientoDelSeleccionado();
                        mostrarEstadisticasDelSeleccionado();
                        const solapa = document.querySelector(".solapa.activa")?.dataset?.tab;
                        if (solapa === "objetos") actualizarInventarioSegunSeleccion();
                    };
                }

                contExtra.appendChild(div);
            });

            const volver = document.createElement("div");
            volver.classList.add("popupOpcionHab");
            volver.textContent = "Volver";

            volver.onclick = () => {
                contExtra.style.display = "none";
                contExtra.innerHTML = "";

                safeShow(btnDesequipar);
                safeShow(btnTraspasar);
                safeShow(btnTirar);
                safeShow(btnCerrar);
            };

            contExtra.appendChild(volver);
        };
    }

    // -------------------------------------------------
    // TIRAR
    // -------------------------------------------------
    if (btnTirar) {
        btnTirar.onclick = () => {

            if (jugador[slotArray] && jugador[slotArray][0] === itemId) {
                jugador[slotArray] = [];
            }

            cerrarPopupEquipamiento();
            mostrarEquipamientoDelSeleccionado();
            mostrarEstadisticasDelSeleccionado();
            const solapa = document.querySelector(".solapa.activa")?.dataset?.tab;
            if (solapa === "objetos") actualizarInventarioSegunSeleccion();
        };
    }

    // -------------------------------------------------
    // CERRAR
    // -------------------------------------------------
    btnCerrar.onclick = () => cerrarPopupEquipamiento();
    fondo.onclick = e => { if (e.target === fondo) cerrarPopupEquipamiento(); };

    fondo.style.display = "flex";
}

// CIERRA el POPUP de ITEMS EQUIPADOS (Solapa PERFIL)
function cerrarPopupEquipamiento() {
    const fondo = document.getElementById("popupFondoHabilidades");
    const contExtra = document.getElementById("popupExtraHab");
    const ventana = document.getElementById("popupVentanaHabilidades");

    if (contExtra) { contExtra.style.display = "none"; contExtra.innerHTML = ""; }

    if (ventana) {
        const prevMsg = ventana.querySelector("#popupMensajeHab");
        if (prevMsg) prevMsg.remove();
    }

    if (fondo) fondo.style.display = "none";
}

// =====================================================
// INICIALIZADOR del POPUP de ITEMS EQUIPADOS (Solapa PERFIL)
// =====================================================

function inicializarPopupEquipamiento() {
    const fondo = document.getElementById("popupFondoHabilidades");
    const ventana = document.getElementById("popupVentanaHabilidades");
    const contExtra = document.getElementById("popupExtraHab");
    const btnDesequipar = document.getElementById("popupDesequiparHab");
    const btnTraspasar = document.getElementById("popupTraspasarHab");
    const btnTirar = document.getElementById("popupTirarHab");
    const btnCerrar = document.getElementById("popupCerrarHab");

    // Si no existe el HTML del popup, no hacemos nada (evita errores)
    if (!fondo || !ventana) return;

    // Asegurarnos que empiece oculto
    fondo.style.display = "none";
    if (contExtra) { contExtra.style.display = "none"; contExtra.innerHTML = ""; }

    // Inicializar estado visual de botones (si existen)
    if (btnDesequipar) btnDesequipar.style.display = "block";
    if (btnTraspasar) btnTraspasar.style.display = "block";
    if (btnTirar) btnTirar.style.display = "block";
    if (btnCerrar) btnCerrar.style.display = "block";

    // Registrar listeners globales una sola vez
    if (!window._popupHabInited) {
        // click en fondo cierra
        fondo.addEventListener("click", (e) => {
            if (e.target === fondo) cerrarPopupEquipamiento();
        });

        // escape cierra
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") cerrarPopupEquipamiento();
        });

        // marcar como inicializado para no duplicar listeners
        window._popupHabInited = true;
    }
}

// =====================================================
// SELECCIÓN DE TARJETA JUGADOR
// =====================================================

function seleccionarTarjeta(jugador, tarjeta) {
    document.querySelectorAll(".cartaJugador")
        .forEach(t => t.classList.remove("seleccionada"));

    tarjeta.classList.add("seleccionada");

    const solapaActiva = document.querySelector(".solapa.activa").dataset.tab;

    if (solapaActiva === "caract") {
        mostrarEstadisticasDelSeleccionado();
        mostrarEquipamientoDelSeleccionado();
        mostrarPuntosHabilidadesDelSeleccionado();
    } 
    else if (solapaActiva === "objetos") {
        actualizarInventarioSegunSeleccion();
    } 
    else if (solapaActiva === "mejoras") {
        inicializarStatsExperiencia();
    }
    else {
        actualizarHechizosSegunSeleccion();
    }
}

// =====================================================
// CALCULAR BONOS DE EQUIPAMIENTO (SOPORTA RANGOS)
// =====================================================

function calcularBonosEquipamientoConRango(jugador) {
    const bonus = {
        fuerza: { min: 0, max: 0 },
        defensa: { min: 0, max: 0 },
        poderMagico: { min: 0, max: 0 },
        defensaMagica: { min: 0, max: 0 },
        velocidad: { min: 0, max: 0 }
    };

    const slots = [
        "armaEquipadx",
        "armaduraEquipadx",
        "escudoEquipadx",
        "cascoEquipadx",
        "accesorioEquipadx"
    ];

    for (let slot of slots) {
        jugador[slot].forEach(idItem => {
            const item = items.find(i => i.itemId === idItem);
            if (!item || !item.efecto) return;

            for (let stat in item.efecto) {
                const valor = item.efecto[stat];

                if (typeof valor === "number") {
                    bonus[stat].min += valor;
                    bonus[stat].max += valor;
                }

                else if (Array.isArray(valor)) {
                    bonus[stat].min += valor[0];
                    bonus[stat].max += valor[1];
                }
            }
        });
    }

    return bonus;
}

// =====================================================
// MOSTRAR ESTADÍSTICAS EN PÁGINA HABILIDADES (CON RANGOS)
// =====================================================

function mostrarEstadisticasDelSeleccionado() {
    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugador = jugadores[tarjeta.dataset.jugadorIndex];
    const info = document.getElementById("infoEstadisticas");

    const bonus = calcularBonosEquipamientoConRango(jugador);

    // Función para capitalizar
    const capitalizar = txt =>
        txt ? txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase() : "";

    // Mapa de clases para mostrar según sexo
    const clasesParaMostrar = {
        guerrero: { masculino: "Guerrero", femenino: "Guerrera" },
        paladin: { masculino: "Paladin", femenino: "Paladina" },
        clerigo: { masculino: "Clérigo", femenino: "Clériga" },
        hechicero: { masculino: "Hechicero", femenino: "Hechicera" }
    };

    // Obtener la clase para mostrar correctamente
    const claseBase = jugador.claseBase?.toLowerCase() || "";
    const sexo = jugador.sexo?.toLowerCase() || "masculino";
    const claseMostrada =
        (clasesParaMostrar[claseBase]
            ? clasesParaMostrar[claseBase][sexo]
            : jugador.clase || jugador.claseBase) || "";

    // Formato de cada stat en la tabla
    const statHTML = (base, bonusObj) => {
        const min = base + bonusObj.min;
        const max = base + bonusObj.max;

        // Sin bonus → todo en NEGRITA
        if (bonusObj.min === 0 && bonusObj.max === 0) {
            return `<b>${base}</b>`;
        }

        // Bonus normal (sin rango)
        if (bonusObj.min === bonusObj.max) {
            return `
                ${base} 
                <span style="color:red;">+${bonusObj.min}</span> 
                <b>(${min})</b>
            `;
        }

        // Bonus rango
        return `
            ${base} 
            <span style="color:red;">+(${bonusObj.min}/${bonusObj.max})</span> 
            <b>(${min}/${max})</b>
        `;
    };

    info.innerHTML = `
        <table class="tablaStats">
            <tr>
                <td class="statNombre">Sexo</td>
                <td class="statValor"><b>${capitalizar(jugador.sexo)}</b></td>
            </tr>

            <tr>
                <td class="statNombre">Clase</td>
                <td class="statValor"><b>${claseMostrada}</b></td>
            </tr>

            <br>

            <tr>
                <td class="statNombre">Fuerza</td>
                <td class="statValor">${statHTML(jugador.fuerza, bonus.fuerza)}</td>
            </tr>

            <tr>
                <td class="statNombre">Defensa</td>
                <td class="statValor">${statHTML(jugador.defensa, bonus.defensa)}</td>
            </tr>

            <tr>
                <td class="statNombre">Poder Mágico</td>
                <td class="statValor">${statHTML(jugador.poderMagico, bonus.poderMagico)}</td>
            </tr>

            <tr>
                <td class="statNombre">Defensa Mágica</td>
                <td class="statValor">${statHTML(jugador.defensaMagica, bonus.defensaMagica)}</td>
            </tr>

            <tr>
                <td class="statNombre">Velocidad</td>
                <td class="statValor">${statHTML(jugador.velocidad, bonus.velocidad)}</td>
            </tr>

            <tr>
                <td class="statNombre">Experiencia</td>
                <td class="statValor"><b>${jugador.experiencia}</b></td>
            </tr>
        </table>
    `;
}

// =====================================================
// ACTUALIZACIÓN EN TIEMPO REAL
// =====================================================

function refrescarPantallaStats() {
    mostrarEstadisticasDelSeleccionado();
}

// =====================================================
// EJEMPLOS: LLAMAR SIEMPRE DESPUÉS DE EQUIPAR / DESEQUIPAR
// =====================================================

function equiparItem(jugador, itemId) {
    // ... tu lógica actual ...
    refrescarPantallaStats();
}

function desequiparItem(jugador, itemId) {
    // ... tu lógica actual ...
    refrescarPantallaStats();
}

function traspasarItem(jugador, itemId) {
    // ... tu lógica actual ...
    refrescarPantallaStats();
}

//------------------------------------------------------------------------------------------------------------------------------

// =====================================================
// SOLAPA INVENTARIO
// =====================================================

let itemSeleccionadoIndex = null;
let itemSeleccionadoId = null;

function compactarInventario(jugador) {
    jugador.inventario = jugador.inventario.filter(v => v !== undefined);
}

function actualizarInventarioSegunSeleccion() {
    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugador = jugadores[tarjeta.dataset.jugadorIndex];

    const cont1 = document.getElementById("inventarioJugador1");
    const cont2 = document.getElementById("inventarioJugador2");
    const cont3 = document.getElementById("inventarioJugador3");

    cont1.innerHTML = "";
    cont2.innerHTML = "";
    cont3.innerHTML = "";

    const target = document.getElementById(
        `inventarioJugador${Number(tarjeta.dataset.jugadorIndex) + 1}`
    );

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 80px)";
    grid.style.gridGap = "8px";
    grid.style.padding = "10px";

    // =======================
    // TOOLTIP ÚNICO DEL SISTEMA
    // =======================
    let tooltip = document.querySelector("#tooltipInventarioGlobal");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "tooltipInventarioGlobal";
        tooltip.className = "tooltip";
        // Fuerzo posicionamiento que no se vea afectado por el transform de la clase
        tooltip.style.position = "fixed";
        tooltip.style.transform = "translate(0,0)";
        tooltip.style.pointerEvents = "none";
        tooltip.style.opacity = "0";
        document.body.appendChild(tooltip);
    } else {
        // asegurar overrides si ya existía
        tooltip.style.position = "fixed";
        tooltip.style.transform = "translate(0,0)";
        tooltip.style.pointerEvents = "none";
    }

    for (let i = 0; i < 15; i++) {
        const cajita = document.createElement("div");
        cajita.classList.add("cajitasInventario");

        const itemId = jugador.inventario[i];

        if (itemId !== undefined) {
            const item = items.find(it => it.itemId === itemId);

            if (item) {
                cajita.style.backgroundImage = `url('${item.img}')`;
                cajita.style.backgroundSize = "cover";
                cajita.style.backgroundPosition = "center";
                cajita.style.cursor = "pointer";
                cajita.style.transition = "filter 0.2s";

                // =======================
                // EFECTO BRILLO
                // =======================
                cajita.addEventListener("mouseenter", () => {
                    cajita.style.filter = "brightness(1.3)";
                });
                cajita.addEventListener("mouseleave", () => {
                    cajita.style.filter = "brightness(1)";
                });

                // =======================
                // TOOLTIP EVENTOS (a la DERECHA del cursor)
                // =======================
                cajita.addEventListener("mouseenter", (e) => {
                    tooltip.textContent = item.nombre;
                    tooltip.style.opacity = "1";

                    // posición inicial a la derecha
                    const offsetX = 18;
                    const offsetY = 12;
                    let left = e.clientX + offsetX;
                    let top = e.clientY + offsetY;

                    // evitar overflow derecho / inferior
                    const rect = tooltip.getBoundingClientRect();
                    const vw = window.innerWidth;
                    const vh = window.innerHeight;

                    if (left + rect.width + 8 > vw) {
                        left = vw - rect.width - 8;
                    }
                    if (top + rect.height + 8 > vh) {
                        top = vh - rect.height - 8;
                    }

                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                });

                cajita.addEventListener("mousemove", (e) => {
                    const offsetX = 18;
                    const offsetY = 12;
                    let left = e.clientX + offsetX;
                    let top = e.clientY + offsetY;

                    const rect = tooltip.getBoundingClientRect();
                    const vw = window.innerWidth;
                    const vh = window.innerHeight;

                    if (left + rect.width + 8 > vw) {
                        left = vw - rect.width - 8;
                    }
                    if (top + rect.height + 8 > vh) {
                        top = vh - rect.height - 8;
                    }

                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                });

                cajita.addEventListener("mouseleave", () => {
                    tooltip.style.opacity = "0";
                });

                // =======================
                // CLICK → ABRIR POPUP
                // =======================
                cajita.addEventListener("click", () => {
                    itemSeleccionadoIndex = i;
                    itemSeleccionadoId = itemId;
                    abrirPopupItem(jugador, item, i);
                });
            }
        }
        grid.appendChild(cajita);
    }
    target.appendChild(grid);
}

// ------------------------------------------------------
// POPUP de los ITEMS que hay en INVENTARIO (Solapa Objetos)
// ------------------------------------------------------
function abrirPopupItem(jugador, item, indexInventario) {

    const popFondo = document.getElementById("popupFondo");
    const btnEquipar = document.getElementById("popupEquipar");
    const btnTraspasar = document.getElementById("popupTraspasar");
    const btnTirar = document.getElementById("popupTirar");
    const btnCerrar = document.getElementById("popupCerrar");
    const listaExtra = document.getElementById("popupOpcionesExtra");
    const popupVentana = document.getElementById("popupVentana");

    if (!popFondo || !popupVentana) return;

    // ------------------------------------------------------
    // RESET — evita duplicación de eventos y elementos residuales
    // ------------------------------------------------------
    if (btnEquipar) btnEquipar.onclick = null;
    if (btnTraspasar) btnTraspasar.onclick = null;
    if (btnTirar) btnTirar.onclick = null;
    if (btnCerrar) btnCerrar.onclick = null;
    popFondo.onclick = null;

    // remover info previo
    const existingInfo = document.getElementById("popupInfoItem");
    if (existingInfo && existingInfo.parentNode) existingInfo.parentNode.removeChild(existingInfo);

    // restaurar botones y limpiar listaExtra
    if (btnEquipar) btnEquipar.style.display = "block";
    if (btnTraspasar) btnTraspasar.style.display = "block";
    if (btnTirar) btnTirar.style.display = "block";
    if (btnCerrar) btnCerrar.style.display = "block";

    if (listaExtra) {
        listaExtra.style.display = "none";
        listaExtra.innerHTML = "";
    }

    window.itemSeleccionadoIndex = indexInventario;

    // ------------------------------------------------------
    // BLOQUE INFO ITEM (nombre, efecto formateado, detalle)
    // ------------------------------------------------------
    const infoBlock = document.createElement("div");
    infoBlock.id = "popupInfoItem";

    // nombre en negrita
    const titulo = document.createElement("div");
    titulo.innerHTML = `<b>${item?.nombre ?? ""}</b>`;
    infoBlock.appendChild(titulo);

    // función para formatear efecto
    function textoEfectoFormateado() {
        const ef = item?.efecto;
        if (!ef) return "";

        if (ef.tipo === "CurarPV" && ef.cantidad !== undefined) return `PV +${ef.cantidad}`;
        if (ef.tipo === "CurarPM" && ef.cantidad !== undefined) return `PM +${ef.cantidad}`;
        if (ef.defensa !== undefined) return `DEFENSA +${ef.defensa}`;
        if (ef.poderMagico !== undefined) return `PODER MAGICO +${ef.poderMagico}`;

        if (ef.fuerza !== undefined) {
            if (Array.isArray(ef.fuerza) && ef.fuerza.length >= 2) return `FUERZA +${ef.fuerza[0]}/+${ef.fuerza[1]}`;
            if (typeof ef.fuerza === "number") return `FUERZA +${ef.fuerza}/+${ef.fuerza}`;
            if (typeof ef.fuerza === "string") {
                const clean = ef.fuerza.replace(/\[|\]/g, "").trim();
                const parts = clean.split("-").map(p => parseInt(p, 10));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    return `FUERZA +${parts[0]}/+${parts[1]}`;
                }
            }
        }

        return "";
    }

    const efectoDiv = document.createElement("div");
    efectoDiv.textContent = textoEfectoFormateado();
    infoBlock.appendChild(efectoDiv);

    // detalle
    if (item?.detalle) {
        const detalle = document.createElement("div");
        detalle.innerHTML = `<i>"${item.detalle}"</i>`;
        infoBlock.appendChild(detalle);
    }

    // ------------------------------------------------------
    // **ÚNICO separador permitido (el que está debajo del detalle del item)**
    // ------------------------------------------------------
    const hrInfo = document.createElement("hr");
    infoBlock.appendChild(hrInfo);

    popupVentana.insertBefore(infoBlock, popupVentana.firstChild);

    // ------------------------------------------------------
    // Mantiene solapa activa
    // ------------------------------------------------------
    function aplicarSolapaVisual(solapa) {
        document.querySelectorAll(".solapa").forEach(b => b.classList.remove("activa"));

        const tabCaract = document.getElementById("tabCaract");
        const tabObjetos = document.getElementById("tabObjetos");
        const tabHechizos = document.getElementById("tabHechizos");

        const dCaract = document.getElementById("divDerechoCaract");
        const dObjetos = document.getElementById("divDerechoObjetos");
        const dHech = document.getElementById("divDerechoHechizos");

        if (tabCaract) tabCaract.style.display = "none";
        if (tabObjetos) tabObjetos.style.display = "none";
        if (tabHechizos) tabHechizos.style.display = "none";

        if (dCaract) dCaract.style.display = "none";
        if (dObjetos) dObjetos.style.display = "none";
        if (dHech) dHech.style.display = "none";

        if (solapa === "objetos") {
            const btn = document.querySelector('.solapa[data-tab="objetos"]');
            if (btn) btn.classList.add("activa");
            if (tabObjetos) tabObjetos.style.display = "flex";
            if (dObjetos) dObjetos.style.display = "flex";
        } else if (solapa === "hechizos") {
            const btn = document.querySelector('.solapa[data-tab="hechizos"]');
            if (btn) btn.classList.add("activa");
            if (tabHechizos) tabHechizos.style.display = "flex";
            if (dHech) dHech.style.display = "flex";
        } else {
            const btn = document.querySelector('.solapa[data-tab="caract"]');
            if (btn) btn.classList.add("activa");
            if (tabCaract) tabCaract.style.display = "flex";
            if (dCaract) dCaract.style.display = "flex";
        }
    }

    // ------------------------------------------------------
    // ITEMS DE CURACIÓN (ItemBatalla tipo CurarPV)
    // ------------------------------------------------------
    if (item && item.tipo === "ItemBatalla" && item.efecto?.tipo === "CurarPV") {

        // botón usar
        if (btnEquipar) {
            btnEquipar.textContent = "Usar";
            btnEquipar.classList.remove("popupBloqueado");
        }

        // CLICK en Usar → lista de objetivos
        if (btnEquipar) btnEquipar.onclick = () => {

            if (btnEquipar) btnEquipar.style.display = "none";
            if (btnTraspasar) btnTraspasar.style.display = "none";
            if (btnTirar) btnTirar.style.display = "none";
            if (btnCerrar) btnCerrar.style.display = "none";

            if (!listaExtra) return;

            listaExtra.style.display = "block";
            listaExtra.innerHTML = "";

            const jugadoresActivos = jugadores.filter(j => j.activo);

            jugadoresActivos.forEach(targetJugador => {

                const estaMuerto = targetJugador.estado === 2; // id 2 = muerto
                const div = document.createElement("div");

                if (estaMuerto) {

                    // --- OPCIÓN BLOQUEADA ---
                    div.classList.add("popupOpcionBloqueada");
                    div.textContent = `Usar sobre ${targetJugador.nombre}`;
                    div.style.color = "gray";
                    div.style.cursor = "default";
                    div.style.textDecoration = "none";

                } else {

                    // --- OPCIÓN NORMAL ---
                    div.classList.add("popupOpcion");
                    div.textContent = `Usar sobre ${targetJugador.nombre}`;

                    div.onclick = () => {
                        const ownerIndex = jugadores.indexOf(jugador);
                        const solapaActiva = document.querySelector(".solapa.activa")?.dataset?.tab || "caract";

                        // Aplicar curación al target
                        targetJugador.pv = Math.min(targetJugador.pvMax, targetJugador.pv + item.efecto.cantidad);

                        // Remover el item del inventario del que lo usó y compactar
                        jugador.inventario[indexInventario] = undefined;
                        compactarInventario(jugador);

                        // Reproducir sonido
                        sonidoCurar.play();

                        // Cerrar popup
                        cerrarPopup();

                        // Actualizar UI del target
                        const tarjetaTarget = document.querySelector(`.cartaJugador[data-jugador-index="${jugadores.indexOf(targetJugador)}"]`);
                        if (tarjetaTarget) {
                            const labelPV = tarjetaTarget.querySelector(".labelStatus");
                            if (labelPV) {
                                labelPV.textContent = `PV ${targetJugador.pv}/${targetJugador.pvMax}`;
                            }
                            const barraVida = tarjetaTarget.querySelector(".barraVida");
                            if (barraVida) {
                                barraVida.style.width = `${(targetJugador.pv / targetJugador.pvMax) * 100}%`;
                            }
                        }

                        // Des-seleccionar todos y seleccionar al owner
                        document.querySelectorAll(".cartaJugador").forEach(c => c.classList.remove("seleccionada"));
                        const tarjetaOwner = document.querySelector(`.cartaJugador[data-jugador-index="${ownerIndex}"]`);
                        if (tarjetaOwner) tarjetaOwner.classList.add("seleccionada");

                        // Restaurar solapa visual
                        aplicarSolapaVisual(solapaActiva);

                        // Efecto visual
                        try {
                            if (typeof mostrarEfectoCurar === "function") {
                                mostrarEfectoCurar(targetJugador, item.efecto.cantidad);
                            }
                        } catch (err) {
                            console.error("Error al ejecutar mostrarEfectoCurar:", err);
                        }

                        // Actualizar paneles
                        if (solapaActiva === "objetos") actualizarInventarioSegunSeleccion();
                        else if (solapaActiva === "hechizos") actualizarHechizosSegunSeleccion();
                        else {
                            mostrarEstadisticasDelSeleccionado();
                            mostrarEquipamientoDelSeleccionado();
                        }
                    };
                }

                listaExtra.appendChild(div);
            });


            // VOLVER (sin hr)
            const volver = document.createElement("div");
            volver.classList.add("popupOpcion");
            volver.textContent = "Volver";
            volver.onclick = () => {
                listaExtra.style.display = "none";
                listaExtra.innerHTML = "";

                if (btnEquipar) btnEquipar.style.display = "block";
                if (btnTraspasar) btnTraspasar.style.display = "block";
                if (btnTirar) btnTirar.style.display = "block";
                if (btnCerrar) btnCerrar.style.display = "block";
            };
            listaExtra.appendChild(volver);

            popFondo.onclick = e => { if (e.target === popFondo) cerrarPopup(); };
            popFondo.style.display = "flex";
        };

        // TRASPASAR curación
        if (btnTraspasar) btnTraspasar.onclick = () => {

            if (btnEquipar) btnEquipar.style.display = "none";
            if (btnTraspasar) btnTraspasar.style.display = "none";
            if (btnTirar) btnTirar.style.display = "none";
            if (btnCerrar) btnCerrar.style.display = "none";

            if (!listaExtra) return;

            listaExtra.style.display = "block";
            listaExtra.innerHTML = "";

            const otrosJugadores = jugadores.filter(j => j !== jugador && j.activo);

            if (otrosJugadores.length === 0) {
                const aviso = document.createElement("div");
                aviso.classList.add("popupOpcion");
                aviso.textContent = "No hay compañeros activos.";
                listaExtra.appendChild(aviso);
            } else {
                otrosJugadores.forEach(dest => {
                    const cantidadValidas = dest.inventario.filter(i => i !== undefined).length;
                    const inventarioLleno = cantidadValidas >= 15;

                    if (!inventarioLleno) {
                        const div = document.createElement("div");
                        div.classList.add("popupOpcion");
                        div.textContent = `Traspasar a ${dest.nombre}`;
                        div.onclick = () => {
                            traspasarItem(jugador, dest, item);
                            cerrarPopup();
                        };
                        listaExtra.appendChild(div);

                    } else {
                        const div = document.createElement("div");
                        div.classList.add("popupOpcionBloqueada");
                        div.textContent = `Traspasar a ${dest.nombre}`;
                        div.style.color = "red";
                        div.style.cursor = "default";
                        div.style.textDecoration = "none";
                        listaExtra.appendChild(div);

                        const aviso = document.createElement("div");
                        aviso.classList.add("popupInventarioLlenoAviso");
                        aviso.textContent = "(Inventario lleno)";
                        listaExtra.appendChild(aviso);
                    }
                });
            }

            // VOLVER (sin hr)
            const volver = document.createElement("div");
            volver.classList.add("popupOpcion");
            volver.textContent = "Volver";
            volver.onclick = () => {
                listaExtra.style.display = "none";
                listaExtra.innerHTML = "";

                if (btnEquipar) btnEquipar.style.display = "block";
                if (btnTraspasar) btnTraspasar.style.display = "block";
                if (btnTirar) btnTirar.style.display = "block";
                if (btnCerrar) btnCerrar.style.display = "block";
            };
            listaExtra.appendChild(volver);

            popFondo.onclick = e => { if (e.target === popFondo) cerrarPopup(); };
            popFondo.style.display = "flex";
        };

        // TIRAR
        if (btnTirar) btnTirar.onclick = () => {
            jugador.inventario[indexInventario] = undefined;
            compactarInventario(jugador);
            cerrarPopup();
            actualizarInventarioSegunSeleccion();
        };

        if (btnCerrar) btnCerrar.onclick = cerrarPopup;

        popFondo.onclick = e => { if (e.target === popFondo) cerrarPopup(); };
        popFondo.style.display = "flex";
        
        return;
    }

    // ------------------------------------------------------
    // Equipamiento (items que NO son de curación)
    // ------------------------------------------------------

    // --- Helpers defensivos para normalizar strings/arrays ---
    function asLowerString(v) {
        if (v === undefined || v === null) return "";
        if (typeof v === "string") return v.toLowerCase();
        if (typeof v === "number") return String(v).toLowerCase();
        return "";
    }

    function asLowerArray(v) {
        if (!v) return [];
        if (Array.isArray(v)) return v.map(x => (x ?? "").toString().toLowerCase());
        return [v.toString().toLowerCase()];
    }

    const itemSexo = asLowerString(item.sexo);
    const jugadorSexo = asLowerString(jugador.sexo);
    const jugadorClaseBase = asLowerString(jugador.claseBase);

    // item.clase puede ser string o array
    const itemClaseArray = asLowerArray(item.clase);

    function sexoCompatible() {
        if (!item.sexo) return true;
        if (itemSexo === "todos" || itemSexo === "ambos") return true;
        return itemSexo === jugadorSexo;
    }

    function claseCompatible() {
        if (!item.clase) return true;

        // si es string y es comodín
        if (typeof item.clase === "string") {
            const claseStr = item.clase.toString().toLowerCase();
            if (claseStr === "todos" || claseStr === "ambos") return true;
        }

        // normalizamos a array y verificamos inclusión
        return itemClaseArray.includes(jugadorClaseBase);
    }

    let puedeEquipar = true;

    if ((item.tipo || "").toString() !== "Equipamiento") puedeEquipar = false;
    if (!sexoCompatible()) puedeEquipar = false;
    if (!claseCompatible()) puedeEquipar = false;

    if (btnEquipar) {
        if (!puedeEquipar) {
            btnEquipar.textContent = "No puede Equiparselo";
            btnEquipar.classList.add("popupBloqueado");
        } else {
            btnEquipar.textContent = "Equipar";
            btnEquipar.classList.remove("popupBloqueado");
        }

        btnEquipar.onclick = () => {
            if (btnEquipar.classList.contains("popupBloqueado")) return;
            equiparItem(jugador, item);
            cerrarPopup();
            actualizarInventarioSegunSeleccion();
        };
    }


    // ------------------------------------------------------
    // TRASPASAR equipamiento
    // ------------------------------------------------------
    const otrosJugadores = jugadores.filter(j => j !== jugador && j.activo);

    if (otrosJugadores.length === 0) {
        if (btnTraspasar) btnTraspasar.style.display = "none";
    }

    if (btnTraspasar) btnTraspasar.onclick = () => {

        if (btnEquipar) btnEquipar.style.display = "none";
        if (btnTraspasar) btnTraspasar.style.display = "none";
        if (btnTirar) btnTirar.style.display = "none";
        if (btnCerrar) btnCerrar.style.display = "none";

        if (!listaExtra) return;

        listaExtra.style.display = "block";
        listaExtra.innerHTML = "";

        otrosJugadores.forEach(dest => {
            const cantidadValidas = dest.inventario.filter(i => i !== undefined).length;
            const inventarioLleno = cantidadValidas >= 15;

            if (!inventarioLleno) {
                const div = document.createElement("div");
                div.classList.add("popupOpcion");
                div.textContent = `Traspasar a ${dest.nombre}`;
                div.onclick = () => {
                    traspasarItem(jugador, dest, item);
                    cerrarPopup();
                };
                listaExtra.appendChild(div);

            } else {
                const div = document.createElement("div");
                div.classList.add("popupOpcionBloqueada");
                div.textContent = `Traspasar a ${dest.nombre}`;
                div.style.color = "red";
                div.style.cursor = "default";
                div.style.textDecoration = "none";
                listaExtra.appendChild(div);

                const aviso = document.createElement("div");
                aviso.classList.add("popupInventarioLlenoAviso");
                aviso.textContent = "(Inventario lleno)";
                listaExtra.appendChild(aviso);
            }
        });

        // VOLVER (sin hr)
        const volver = document.createElement("div");
        volver.classList.add("popupOpcion");
        volver.textContent = "Volver";
        volver.onclick = () => {
            listaExtra.style.display = "none";
            listaExtra.innerHTML = "";

            if (btnEquipar) btnEquipar.style.display = "block";
            if (btnTraspasar) btnTraspasar.style.display = "block";
            if (btnTirar) btnTirar.style.display = "block";
            if (btnCerrar) btnCerrar.style.display = "block";
        };
        listaExtra.appendChild(volver);

        popFondo.onclick = e => { if (e.target === popFondo) cerrarPopup(); };
        popFondo.style.display = "flex";
    };

    // ------------------------------------------------------
    // TIRAR equipamiento
    // ------------------------------------------------------
    if (btnTirar) btnTirar.onclick = () => {
        jugador.inventario[indexInventario] = undefined;
        compactarInventario(jugador);
        cerrarPopup();
        actualizarInventarioSegunSeleccion();
    };

    if (btnCerrar) btnCerrar.onclick = cerrarPopup;

    popFondo.onclick = e => { if (e.target === popFondo) cerrarPopup(); };
    popFondo.style.display = "flex";
}


// ------------------------------------------------------
// Funcion TRASPASAR ITEM (Revisa que el otro jugador no tenga el inventario lleno):
// ------------------------------------------------------
function traspasarItem(origen, destino, item) {

    // Verificación defensiva: no permitir traspasar si destino ya tiene 15 items válidos
    const destinoCount = Array.isArray(destino.inventario) ? destino.inventario.filter(i => i !== undefined).length : 0;
    if (destinoCount >= 15) {
        // No hacemos nada — la UI ya debería bloquear la opción.
        return;
    }

    origen.inventario[itemSeleccionadoIndex] = undefined;
    compactarInventario(origen);

    // Agregar al último lugar libre de destino
    let ultimoLibre = -1;
    for (let i = 0; i < destino.inventario.length; i++) {
        if (destino.inventario[i] === undefined) ultimoLibre = i;
    }

    if (ultimoLibre !== -1) destino.inventario[ultimoLibre] = item.itemId;
    else destino.inventario.push(item.itemId);

    actualizarInventarioSegunSeleccion();
}

// ------------------------------------------------------
// Funcion CERRAR POPUP (el de la solapa OBJETOS)
// ------------------------------------------------------
function cerrarPopup() {
    document.getElementById("popupFondo").style.display = "none";
    document.getElementById("popupOpcionesExtra").style.display = "none";
}

// ------------------------------------------------------
// Funcion EQUIPAR (desde el Pop de la solapa OBJETOS)
// ------------------------------------------------------
function equiparItem(jugador, item) {
    const slot = item.slot;
    if (!slot) return;

    const slotArray = `${slot}Equipadx`;

    if (!jugador[slotArray]) jugador[slotArray] = [];

    if (jugador[slotArray].length > 0) {
        const viejoItemId = jugador[slotArray][0];

        let ultimoLibre = -1;
        for (let i = 0; i < jugador.inventario.length; i++) {
            if (jugador.inventario[i] === undefined) ultimoLibre = i;
        }

        if (ultimoLibre !== -1) jugador.inventario[ultimoLibre] = viejoItemId;
        else jugador.inventario.push(viejoItemId);
    }

    jugador[slotArray] = [item.itemId];

    jugador.inventario[itemSeleccionadoIndex] = undefined;
    compactarInventario(jugador);

    mostrarEquipamientoDelSeleccionado(jugador);
    actualizarInventarioSegunSeleccion();
}

//-------------------------------------------------------------------------------------------------------------------
// =====================================================
// SOLAPA HECHIZOS
// =====================================================

// ACTUALIZAR HECHIZOS SEGÚN JUGADOR SELECCIONADO
function actualizarHechizosSegunSeleccion() {

    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugador = jugadores[tarjeta.dataset.jugadorIndex];
    const jugadorMuerto = Number(jugador.pv) <= 0;

    // Contenedores individuales
    const cont1 = document.getElementById("hechizosJugador1");
    const cont2 = document.getElementById("hechizosJugador2");
    const cont3 = document.getElementById("hechizosJugador3");

    if (cont1) cont1.innerHTML = "";
    if (cont2) cont2.innerHTML = "";
    if (cont3) cont3.innerHTML = "";

    const contenedor = document.getElementById(
        `hechizosJugador${Number(tarjeta.dataset.jugadorIndex) + 1}`
    );
    if (!contenedor) return;

    // No tiene hechizos
    if (!jugador.ataques || jugador.ataques.length === 0) {
        contenedor.innerHTML = `<p>${jugador.nombre} no conoce ningún ataque.</p>`;
        return;
    }

    // Crear tabla
    const tabla = document.createElement("table");
    tabla.classList.add("tablaHechizos");

    tabla.innerHTML = `
        <tr class="filaTitulo">
            <th class="colHechizo">Físico</th>
            <th class="colHechizo">Mágico</th>
            <th class="colHechizo">Curación</th>
            <th class="colHechizo">Conjuro</th>
        </tr>
        <tr>
            <td id="colFisico"></td>
            <td id="colMagico"></td>
            <td id="colCuracion"></td>
            <td id="colConjuro"></td>
        </tr>
    `;

    contenedor.appendChild(tabla);

    // Columnas
    const colFisico   = tabla.querySelector("#colFisico");
    const colMagico   = tabla.querySelector("#colMagico");
    const colCuracion = tabla.querySelector("#colCuracion");
    const colConjuro  = tabla.querySelector("#colConjuro");

    // RELLENAR COLUMNAS
    jugador.ataques.forEach(ataque => {

        const item = document.createElement("div");
        item.classList.add("hechizoItem");
        item.textContent = ataque.nombre;

        const pmNecesaria = Number(ataque.pmNecesaria) || 0;
        const tienePM = (Number(jugador.pm) || 0) >= pmNecesaria;

        // SI EL JUGADOR ESTÁ MUERTO → Todo gris y sin Click
        if (jugadorMuerto) {
            item.style.color = "gray";
            item.style.opacity = "0.5";
            item.style.cursor = "default";
        }
        else {
            // Detectar si el ataque es de curacion y/o si es "revivir" por efecto
            const tipoAtaque = (ataque.tipo || "").toString().toLowerCase();
            const efectoTipo = String(ataque.efecto?.tipo || "").toLowerCase();
            const esCuracion = tipoAtaque === "curacion";
            const esRevivir = efectoTipo === "revivir";

            if (esCuracion) {
                // CURACIÓN (incluye revivir como subcaso)
                if (tienePM) {
                    item.style.color = "blue";
                    item.style.cursor = "pointer";
                    item.style.textDecoration = "underline";

                    item.addEventListener("click", () => {
                        abrirPopupCuracion(jugador, ataque);
                    });
                } else {
                    item.style.color = "black";
                    item.style.opacity = "0.5";
                    item.style.cursor = "default";
                }
            } else {
                // OTROS HECHIZOS (físico, magia, conjuro)
                if (tienePM) {
                    item.style.cursor = "pointer";
                } else {
                    item.style.opacity = "0.5";
                    item.style.cursor = "default";
                }
            }
        }

        // CLASIFICACIÓN
        const tipo = (ataque.tipo || "").toLowerCase();

        switch (tipo) {
            case "fisico":
                colFisico.appendChild(item);
                break;

            case "magia":
            case "magico":
            case "mágico":
                colMagico.appendChild(item);
                break;

            case "curacion":
                colCuracion.appendChild(item);
                break;

            case "conjuro":
                colConjuro.appendChild(item);
                break;

            default:
                colConjuro.appendChild(item);
                break;
        }
    });
}

function abrirPopupCuracion(jugadorQueLanza, ataque) {

    const popup = document.getElementById("popupCuracion");
    const lista = document.getElementById("listaOpcionesCurar");
    const nombreHechizoDiv = document.getElementById("nombreHechizoPop");

    // Nombre del hechizo
    if (nombreHechizoDiv) {
        nombreHechizoDiv.innerHTML = `
            <b style="font-size:18px;">
                ${ataque.nombre} (PM: ${ataque.pmNecesaria})
            </b>
        `;
    }

    lista.innerHTML = "<hr>";
    const esRevivir = String(ataque.efecto?.tipo || "").toLowerCase() === "revivir";
    let agregoAlgunJugador = false;
    jugadores.forEach((j) => {

        const objetivoVivo = Number(j.pv) > 0;
        const objetivoMuerto = Number(j.pv) <= 0;
        let puedeAparecer = false;

        if (esRevivir) {
            puedeAparecer = objetivoMuerto && j.activo;
        } else {
            puedeAparecer = objetivoVivo && j.activo;
        }

        if (puedeAparecer) {
            const div = document.createElement("div");
            div.className = "opcionCurarItem";
            div.textContent = `${j.nombre} (PV: ${j.pv}/${j.pvMax})`;
            div.style.cursor = "pointer";

            div.addEventListener("click", () => {
                ejecutarCuracion(jugadorQueLanza, j, ataque);
            });

            lista.appendChild(div);
            agregoAlgunJugador = true;
        }
    });

    // Si NO hay jugadores disponibles
    if (!agregoAlgunJugador) {
        const msg = document.createElement("div");
        msg.style.padding = "10px";
        msg.style.fontStyle = "italic";
        msg.style.cursor = "default";
        msg.style.userSelect = "none";
        msg.style.fontWeight = "normal";

        // Efecto hover: negrita + cursiva, sin subrayado
        msg.addEventListener("mouseenter", () => {
            msg.style.fontWeight = "normal";
            msg.style.textDecoration = "none";
            msg.style.color = "black";
        });
        msg.addEventListener("mouseleave", () => {
            msg.style.fontWeight = "normal";
            msg.style.textDecoration = "none";
        });

        msg.textContent = esRevivir
            ? "No hay jugadores muertos para revivir."
            : "No hay jugadores que puedan ser curados.";

        lista.appendChild(msg);
    }
    popup.classList.remove("popupOculto");
}

// ======================================================================
// CERRAR POPUP DE CURACIÓN
// ======================================================================
function cerrarPopupCuracion() {
    const popup = document.getElementById("popupCuracion");
    if (popup) popup.classList.add("popupOculto");
}

async function ejecutarCuracion(jugadorQueLanza, objetivo, ataque) {

    jugadorQueLanza.pm = Number(jugadorQueLanza.pm) || 0;
    jugadorQueLanza.pmMax = Number(jugadorQueLanza.pmMax) || 1;

    const costo = Number(ataque.pmNecesaria) || 0;
    const cantidadCurada = Number(ataque.efecto?.cantidad) || 0;

    // 1) Verificar PM
    if (jugadorQueLanza.pm < costo) {
        alert("No tienes PM suficientes.");
        return;
    }

    // 2) Restar PM SIEMPRE
    jugadorQueLanza.pm -= costo;

    const efectoTipo = String(ataque.efecto?.tipo || "").toLowerCase();

    // **PROBABILIDAD DE FALLO**
    const precision = Number(ataque.precision) || 100;
    const tiro = Math.random() * 100;

    if (tiro > precision) {

        if (typeof sonidoRevivirFallido !== "undefined") {
            sonidoRevivirFallido.currentTime = 0;   // reiniciar
            sonidoRevivirFallido.play().catch(() => {});
        }

        actualizarTarjetaJugador(jugadorQueLanza);
        actualizarTarjetaJugador(objetivo);

        cerrarPopupCuracion();
        return;
    }


    if (efectoTipo === "revivir") {

        if (Number(objetivo.pv) <= 0) {
            objetivo.pv = Math.min(Number(objetivo.pvMax) || 0, cantidadCurada);
            objetivo.estado = 1;

            // 🔊 SONIDO DE REVIVIR EXITOSO
            if (typeof sonidoRevivirExitoso !== "undefined") {
                sonidoRevivirExitoso.currentTime = 0;
                sonidoRevivirExitoso.play().catch(()=>{});
            }

            mostrarEfectoRevivir(objetivo, cantidadCurada);
        }

    } else {
        const antes = Number(objetivo.pv) || 0;
        const nueva = Math.min(Number(objetivo.pvMax) || antes, antes + cantidadCurada);
        objetivo.pv = nueva;

        if (cantidadCurada > 0) mostrarEfectoCurar(objetivo, cantidadCurada);
    }

    if (efectoTipo !== "revivir") {
        if (typeof sonidoCurar !== "undefined") sonidoCurar.play();
    }

    actualizarTarjetaJugador(objetivo);
    actualizarTarjetaJugador(jugadorQueLanza);

    cerrarPopupCuracion();

    const solapaActiva = document.querySelector(".solapa.activa")?.dataset?.tab;
    if (solapaActiva === "hechizos") {
        actualizarHechizosSegunSeleccion();
    }
}

// EFECTO CURACION:
function mostrarEfectoCurar(jugador, cantidadCurada) {

    const indice = jugadores.indexOf(jugador);
    const tarjetaJugador = document.querySelector(`.cartaJugador[data-jugador-index="${indice}"]`);
    if (!tarjetaJugador) return;

    // Crear el contenedor dentro de la carta
    const contenedorEfecto = document.createElement("div");
    contenedorEfecto.classList.add("contenedorEfectoCuracion");
    tarjetaJugador.appendChild(contenedorEfecto);

    // Posiciones X (columnas) respecto al centro de la carta
    const posicionesX = [-25, -8, 8, 25];

    // Orden personalizado: 2 → 3 → 1 → 4
    const ordenCruces = [1, 2, 0, 3];

    for (let i = 0; i < 4; i++) {

        const idx = ordenCruces[i];

        const cruz = document.createElement("img");
        cruz.src = "imgs/otras/cruzHeal.png";
        cruz.classList.add("cruzCuracion");

        // Posición inicial: centrado abajo de la carta
        cruz.style.left = `calc(50% + ${posicionesX[idx]}px)`;
        cruz.style.bottom = `0px`;

        contenedorEfecto.appendChild(cruz);

        // Animación según orden
        setTimeout(() => {
            cruz.style.animation = `subirYDesvanecer 1s ease-out forwards`;
        }, i * 200);
    }

    // Quitar contenedor después del efecto
    setTimeout(() => {
        contenedorEfecto.remove();
    }, 4 * 200 + 1200);
}

// EFECTO REVIVIR:
function mostrarEfectoRevivir(jugador, cantidadCurada) {

    const indice = jugadores.indexOf(jugador);
    const tarjetaJugador = document.querySelector(`.cartaJugador[data-jugador-index="${indice}"]`);
    if (!tarjetaJugador) return;

    // Crear el contenedor dentro de la carta
    const contenedorEfecto = document.createElement("div");
    contenedorEfecto.classList.add("contenedorEfectoCuracion");
    tarjetaJugador.appendChild(contenedorEfecto);

    // Posiciones X (columnas) respecto al centro de la carta
    const posicionesX = [-25, -8, 8, 25];

    // Orden personalizado: 2 → 3 → 1 → 4
    const ordenCruces = [1, 2, 0, 3];

    for (let i = 0; i < 4; i++) {

        const idx = ordenCruces[i];

        const cruz = document.createElement("img");
        cruz.src = "imgs/otras/cruzRevive.png";
        cruz.classList.add("cruzCuracion");

        // Posición inicial: centrado abajo de la carta
        cruz.style.left = `calc(50% + ${posicionesX[idx]}px)`;
        cruz.style.bottom = `0px`;

        contenedorEfecto.appendChild(cruz);

        // Animación según orden
        setTimeout(() => {
            cruz.style.animation = `subirYDesvanecer 1s ease-out forwards`;
        }, i * 200);
    }

    // Quitar contenedor después del efecto
    setTimeout(() => {
        contenedorEfecto.remove();
    }, 4 * 200 + 1200);
}

// ======================================================================
// ACTUALIZAR TARJETA DEL JUGADOR (PV / PM)
// ======================================================================
function actualizarTarjetaJugador(jugador) {

    const index = jugadores.indexOf(jugador);
    const tarjeta = document.querySelector(
        `.cartaJugador[data-jugador-index="${index}"]`
    );
    if (!tarjeta) return;

    // -------------------------------
    // ACTUALIZAR ICONO SEGÚN ESTADO
    // -------------------------------
    const imgIcono = tarjeta.querySelector(".iconoJugador img"); // <-- FIX REAL
    if (imgIcono) {

        let ruta = jugador.imgIcono; // por defecto vivo

        // muerto si pv <= 0
        if (Number(jugador.pv) <= 0) {
            ruta = jugador.imgIconoMuerto;
        }
        // envenenado: solo si está vivo
        else if (jugador.estado === 3) {
            ruta = jugador.imgIconoEnvenenado;
        }

        imgIcono.src = ruta;
    }

    // Normalizar pm fields
    jugador.pm = (typeof jugador.pm !== "undefined") ? Number(jugador.pm)
    : (jugador.pmMax ? Number(jugador.pmMax) : 0);

    jugador.pmMax = (typeof jugador.pmMax !== "undefined") ? Number(jugador.pmMax)
    : (jugador.pm ? Number(jugador.pm) : 1);

    // PV
    const labels = tarjeta.querySelectorAll(".labelStatus");

    if (labels[0]) {
        labels[0].textContent = `PV ${jugador.pv}/${jugador.pvMax}`;
    }

    const barraVida = tarjeta.querySelector(".barraVida");
    if (barraVida) {
        const porc = Math.max(0, Math.min(100, (Number(jugador.pv) / Number(jugador.pvMax)) * 100));
        barraVida.style.width = `${porc}%`;
    }

    // PM
    if (labels[1]) {
        labels[1].textContent = `PM ${jugador.pm}/${jugador.pmMax}`;
    }

    const barraMana = tarjeta.querySelector(".barraMana");
    if (barraMana) {
        const porc = Math.max(0, Math.min(100, (Number(jugador.pm) / Number(jugador.pmMax)) * 100));
        barraMana.style.width = `${porc}%`;
    }
}



// ======================================================================
// BOTÓN DE CERRAR POPUP
// ======================================================================
const btnCerrar = document.getElementById("btnCerrarPopupCuracion");
if (btnCerrar) btnCerrar.onclick = () => cerrarPopupCuracion();




















//-------------------------------------------------------------------------------------------------------------------

// =====================================================
// SOLAPA EXPERIENCIA
// =====================================================

const maxNivel = 10;

// Mapeo entre nombre de stat en HTML y propiedad real en objeto jugador
const statMap = {
    fuerza: "fuerza",
    defensa: "defensa",
    poderMagico: "poderMagico",
    defensaMagica: "defensaMagica",
    velocidad: "velocidad",
    experiencia: "experiencia"
};

// Estado temporal para Mejoras (mantener puntos asignados antes de guardar)
let mejorasTemp = {};

/**
 * calcularValor(statKey, nivelDestino, jugador)
 * Devuelve el valor TOTAL de la stat hasta 'nivelDestino' sumando los incrementos.
 * AHORA LEE stats base directamente del jugador (formato B).
 */
function calcularValor(statKey, nivelDestino, jugador) {

    let base = jugador.statsBase?.[statKey] ?? 0;
    let extra = 0;

    for (let lvl = 2; lvl <= nivelDestino; lvl++) {
        extra += crecimientoStats[statKey]?.[lvl] ?? 0;
    }

    return base + extra;
}

// Inicializa stats de cada jugador (al menos nivel 1) y sincroniza los valores
jugadores.forEach(j => {

    // ==========================
    // CREAR STATS BASE
    // ==========================
    if (!j.statsBase) {
        j.statsBase = {
            fuerza: j.fuerza ?? 0,
            defensa: j.defensa ?? 0,
            poderMagico: j.poderMagico ?? 0,
            defensaMagica: j.defensaMagica ?? 0,
            velocidad: j.velocidad ?? 0
        };
    }

    // ==========================
    // CREAR NIVELES DE STAT
    // ==========================
    if (!j.nivelesStat) {
        j.nivelesStat = {
            fuerza: 1,
            defensa: 1,
            poderMagico: 1,
            defensaMagica: 1,
            velocidad: 1
        };
    }

    // ==========================
    // RE-CALCULAR VALORES SEGÚN NIVELES
    // ==========================
    Object.keys(statMap).forEach(statKey => {
        const realStat = statMap[statKey];

        if (j.nivelesStat[realStat] == null) {
            j.nivelesStat[realStat] = 1;
        }

        j[realStat] = calcularValor(realStat, j.nivelesStat[realStat], j);
    });

    // Sincronizar puntos de habilidad
    if (j.puntosHabilidad == null) {
        j.puntosHabilidad = j.puntosDisponibles ?? 0;
    }
});

/** Muestra puntos disponibles del jugador seleccionado */
function mostrarPuntosHabilidadesDelSeleccionado() {
    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugadorIndex = parseInt(tarjeta.dataset.jugadorIndex, 10);
    const temp = mejorasTemp[jugadorIndex];
    const jugador = jugadores[jugadorIndex];
    const divPuntos = document.getElementById("mostrarPuntosDisponibles");

    if (!divPuntos) return;

    divPuntos.textContent = `Puntos Disponibles: ${temp ? temp.puntosHabilidad : jugador.puntosHabilidad}`;
}

function inicializarStatsExperiencia() {
    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugadorIndex = parseInt(tarjeta.dataset.jugadorIndex, 10);
    const jugador = jugadores[jugadorIndex];
    const puntosDisponiblesElem = document.getElementById('mostrarPuntosDisponibles');
    const statsElems = document.querySelectorAll('#divBotones_y_Stats .stat');

    // Crear copia temporal si no existe
    if (!mejorasTemp[jugadorIndex]) {
        mejorasTemp[jugadorIndex] = {
            niveles: { ...jugador.nivelesStat },
            puntosHabilidad: jugador.puntosHabilidad
        };
    }

    const temp = mejorasTemp[jugadorIndex];

    function actualizarBarrita(statElem, realStat) {
        const valorTemp = temp.niveles[realStat];
        const valorReal = jugador.nivelesStat[realStat] ?? 1;
        const barras = statElem.querySelectorAll(".barrita div");

        barras.forEach((b, i) => {
            b.classList.remove("activo", "proyectado");
            if (i < valorReal) b.classList.add("activo");
            else if (i < valorTemp) b.classList.add("proyectado");
        });

        const valorActualCorrecto = calcularValor(realStat, valorReal, jugador);
        const valorNuevo = calcularValor(realStat, valorTemp, jugador);

        const valorActualElem = statElem.querySelector(".valorActual");

        if (valorTemp > valorReal) {
            valorActualElem.innerHTML = `
                <strong style="color:black">${valorActualCorrecto}</strong>
                <strong style="color:red; margin-left:8px;">&gt; ${valorNuevo}</strong>
            `;
        } else {
            valorActualElem.innerHTML = `<strong style="color:black">${valorActualCorrecto}</strong>`;
        }
    }

    function actualizarUI() {
        puntosDisponiblesElem.textContent = `Puntos Disponibles: ${temp.puntosHabilidad}`;

        statsElems.forEach(statElem => {
            const statKey = statElem.dataset.stat;
            const realStat = statMap[statKey];

            let label = statElem.querySelector('.stat-label');
            if (!label) {
                label = document.createElement('div');
                label.className = 'stat-label';
                statElem.insertBefore(label, statElem.querySelector('.btn-restar'));
            }

            const fancyName = statKey
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, s => s.toUpperCase());

            label.textContent = fancyName;

            actualizarBarrita(statElem, realStat);
        });

        mostrarPuntosHabilidadesDelSeleccionado();
    }

    function inicializarBarritas() {
        statsElems.forEach(statElem => {
            const barrita = statElem.querySelector(".barrita");
            if (!barrita) return;

            barrita.innerHTML = "";
            for (let i = 0; i < maxNivel; i++) {
                const div = document.createElement("div");
                barrita.appendChild(div);
            }
        });
    }

    inicializarBarritas();
    actualizarUI();

    // BOTONES +
    statsElems.forEach(statElem => {
        const statKey = statElem.dataset.stat;
        const realStat = statMap[statKey];
        const btnSumar = statElem.querySelector(".btn-sumar");
        const btnRestar = statElem.querySelector(".btn-restar");

        if (btnSumar) btnSumar.onclick = () => {
            let valor = temp.niveles[realStat];
            if (valor < maxNivel && temp.puntosHabilidad > 0) {
                temp.niveles[realStat]++;
                temp.puntosHabilidad--;
                actualizarBarrita(statElem, realStat);
                puntosDisponiblesElem.textContent = `Puntos Disponibles: ${temp.puntosHabilidad}`;
            }
        };

        if (btnRestar) btnRestar.onclick = () => {
            const valor = temp.niveles[realStat];
            const nivelBase = jugador.nivelesStat[realStat] ?? 1;
            if (valor > nivelBase) {
                temp.niveles[realStat]--;
                temp.puntosHabilidad++;
                actualizarBarrita(statElem, realStat);
                puntosDisponiblesElem.textContent = `Puntos Disponibles: ${temp.puntosHabilidad}`;
            }
        };
    });

    // GUARDAR MEJORAS
    const btnGuardar = document.getElementById('guardarNuevosStats');

    if (btnGuardar) {
        btnGuardar.onclick = () => {

            const mejorasDetectadas = [];

            statsElems.forEach(statElem => {
                const statKey = statElem.dataset.stat;
                const realStat = statMap[statKey];

                const nuevoNivel = temp.niveles[realStat];
                const nivelBase = jugador.nivelesStat[realStat] ?? 1;

                if (nuevoNivel > nivelBase) {

                    const valorActual = calcularValor(realStat, nivelBase, jugador);
                    const valorNuevo = calcularValor(realStat, nuevoNivel, jugador);

                    mejorasDetectadas.push({
                        statKey,
                        realStat,
                        valorActual,
                        valorNuevo
                    });
                }
            });

            if (mejorasDetectadas.length === 0) return;

            const popup = document.getElementById("popupMejoras");
            const texto = document.getElementById("popupTextoMejoras");

            let contenido = `<div style="text-align:center;">`;

            mejorasDetectadas.forEach(m => {
                const nombre = m.statKey
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, s => s.toUpperCase());

                contenido += `
                    <div style="margin-bottom:5px;">
                        <div>${nombre}</div>
                        <div><strong style="color:black">${m.valorActual}</strong> &gt; <strong style="color:red">${m.valorNuevo}</strong></div>
                    </div>
                `;
            });

            const puntosIniciales = jugador.puntosHabilidad;
            const puntosRestantes = temp.puntosHabilidad;
            const puntosAGastar = puntosIniciales - puntosRestantes;

            contenido += `
                <div style="margin-top:10px; margin-bottom:10px; font-style:italic;">
                    ¿Quieres gastar ${puntosAGastar} puntos de habilidad?
                </div>
            `;

            contenido += `</div>`;
            texto.innerHTML = contenido;
            popup.style.display = "flex";

            const btnAceptar = document.getElementById("btnAceptarMejora");
            const btnCancelar = document.getElementById("btnCancelarMejora");

            btnAceptar.onclick = () => {

                statsElems.forEach(statElem => {
                    const statKey = statElem.dataset.stat;
                    const realStat = statMap[statKey];

                    const nuevoNivel = temp.niveles[realStat];
                    jugador.nivelesStat[realStat] = nuevoNivel;

                    jugador[realStat] = calcularValor(realStat, nuevoNivel, jugador);
                });

                jugador.puntosHabilidad = temp.puntosHabilidad;

                popup.style.display = "none";
                actualizarUI();
                refrescarPantallaStats(); // Actualizamos el nuevo valor guardado en la pestaña Perfil
            };


            btnCancelar.onclick = () => {
                popup.style.display = "none";
            };
        };
    }
}

// =====================================================
// SELECCIÓN DE TARJETA JUGADOR
// =====================================================

function seleccionarTarjeta(jugador, tarjeta) {
    document.querySelectorAll(".cartaJugador")
        .forEach(t => t.classList.remove("seleccionada"));

    tarjeta.classList.add("seleccionada");

    // asegurarse de leer el tab activo (si no existe, salir)
    const solapaActivaEl = document.querySelector(".solapa.activa");
    const solapaActiva = solapaActivaEl ? solapaActivaEl.dataset.tab : null;

    if (!solapaActiva) return;

    if (solapaActiva === "caract") {
        mostrarEstadisticasDelSeleccionado();
        mostrarEquipamientoDelSeleccionado();
        mostrarPuntosHabilidadesDelSeleccionado();
    } 
    else if (solapaActiva === "objetos") {
        actualizarInventarioSegunSeleccion();
    } 
    // Hay sitios donde la solapa se llama "experiencia" (según tu código anterior).
    // Aceptamos ambos nombres por compatibilidad ("mejoras" por si lo usaste antes).
    else if (solapaActiva === "experiencia" || solapaActiva === "mejoras") {
        inicializarStatsExperiencia();
    }
    else {
        actualizarHechizosSegunSeleccion();
    }
}

// Activar selección de jugador al hacer click en tarjeta (usa seleccionarTarjeta para coherencia)
function activarTarjetaJugador() {
    const tarjetas = document.querySelectorAll(".cartaJugador");
    tarjetas.forEach((tarjeta, index) => {
        // eliminar handler previo y registrar uno consistente
        tarjeta.onclick = null;
        tarjeta.addEventListener("click", () => {
            const jugadorIndex = parseInt(tarjeta.dataset.jugadorIndex, 10);
            const jugador = jugadores[jugadorIndex];
            seleccionarTarjeta(jugador, tarjeta);
        });
    });
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // si hay tarjetas, marcar la primera como seleccionada y disparar selección real
    const primeraTarjeta = document.querySelector(".cartaJugador");
    if (primeraTarjeta) {
        // marcamos visualmente
        document.querySelectorAll(".cartaJugador").forEach(t => t.classList.remove("seleccionada"));
        primeraTarjeta.classList.add("seleccionada");
    }

    activarTarjetaJugador();

    // Si la solapa activa inicial es la de mejoras/experiencia, inicializamos
    const solapaActiva = document.querySelector(".solapa.activa")?.dataset.tab;
    if (solapaActiva === "experiencia" || solapaActiva === "mejoras") {
        // llamar a seleccionarTarjeta sobre la tarjeta marcada (porque esa función decide qué actualizar según solapa)
        const tarjetaSel = document.querySelector(".cartaJugador.seleccionada");
        if (tarjetaSel) {
            const idx = parseInt(tarjetaSel.dataset.jugadorIndex, 10);
            seleccionarTarjeta(jugadores[idx], tarjetaSel);
        } else {
            inicializarStatsExperiencia();
        }
    }
});













// =====================================================
// BOTON PARA SALIR de "INFO JUGADOR"
// =====================================================

btnPaginaStatus.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaStatus.style.display = "block";

    actualizarPaginaStatus();
});

//---------------------------------------------------------------------------------------------------------------------------------------
// PAGINA FORMACION:


// ================================================
// POSICIONES DE FORMACION (PERSISTENTES)
// ================================================
let posicionesFormacion = {
    1: { fila: 2, col: 3 },  // Jugador 1 (Principal)
    2: { fila: 1, col: 1 },  // Jugador 2
    3: { fila: 3, col: 1 }   // Jugador 3 
};

// POSICIONES QUE SE USAN SOLO DURANTE LA PELEA (copia de posicionesFormacion)
let posicionesEnPelea = null;

// ================================================
// VARIABLES
// ================================================
let jugadorSeleccionado = null;

// ================================================
// TABLERO FORMACION
// ================================================

function crearTableroFormacion() {
    const contenedor = document.getElementById("tableroFormacion");
    contenedor.innerHTML = "";

    const tabla = document.createElement("table");
    tabla.id = "tablaFormacion";
    tabla.style.borderCollapse = "collapse";

    // Crear grilla 3x3
    for (let fila = 1; fila <= 3; fila++) {
        const tr = document.createElement("tr");
        for (let col = 1; col <= 3; col++) {
            const td = document.createElement("td");
            td.dataset.fila = fila;
            td.dataset.col = col;
            td.classList.add("casillero-formacion");
            td.addEventListener("click", () => seleccionarCasillero(fila, col));
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }

    contenedor.appendChild(tabla);

    colocarJugadoresActivos();
}

function colocarJugadoresActivos() {
    jugadores.forEach(j => {
        if (!j.activo) return;

        const pos = posicionesFormacion[j.id];
        if (!pos) return;

        ponerJugadorEnCasillero(j.id, pos.fila, pos.col);
    });
}

function ponerJugadorEnCasillero(idJugador, fila, col) {

    const td = document.querySelector(
        `#tablaFormacion td[data-fila="${fila}"][data-col="${col}"]`
    );

    if (!td) return;
    td.innerHTML = "";

    const jugador = jugadores.find(j => j.id === idJugador);
    if (!jugador) return;

    // --- NUEVO: obtener icono según estado ---
    const iconoCorrecto = obtenerIconoSegunEstado(jugador);

    const img = document.createElement("img");
    img.src = iconoCorrecto;
    img.classList.add("icono-personaje");
    img.dataset.jugadorId = idJugador;

    img.addEventListener("click", (e) => {
        e.stopPropagation();
        seleccionarJugador(idJugador);
    });

    td.appendChild(img);
}

function seleccionarJugador(idJugador) {
    jugadorSeleccionado = idJugador;

    // Quitar brillo de todos
    document.querySelectorAll("#tablaFormacion img").forEach(img => {
        img.style.filter = "none";
    });

    // Marcar el seleccionado
    const imgSel = document.querySelector(`#tablaFormacion img[data-jugador-id="${idJugador}"]`);
    if (imgSel) imgSel.style.filter = "drop-shadow(0 0 8px white)";
}

function seleccionarCasillero(fila, col) {
    if (!jugadorSeleccionado) return;

    limpiarIconoJugador(jugadorSeleccionado);
    ponerJugadorEnCasillero(jugadorSeleccionado, fila, col);

    posicionesFormacion[jugadorSeleccionado] = { fila, col };

    jugadorSeleccionado = null;

    document.querySelectorAll("#tablaFormacion img").forEach(img => {
        img.style.filter = "none";
    });
}

function limpiarIconoJugador(idJugador) {
    document.querySelectorAll("#tablaFormacion td").forEach(td => {
        if (
            td.firstChild &&
            td.firstChild.dataset &&
            td.firstChild.dataset.jugadorId == idJugador
        ) {
            td.innerHTML = "";
        }
    });
}

//------------------------------------------------------------------------------------------------------------------------------------

// ==========================================================
// DATABASE del DUNGEON
// ==========================================================

let piso = 1;
let pisoMaximoAlcanzado = 1;
let batallasGanadas = 0;
let numeroRonda = 1;

function actualizarPiso() {
    document.getElementById("pisoActual").textContent = "Piso " + piso;
}

// Qué enemigos pueden aparecer por piso (IDs de tu lista enemigos[])
const enemigosPorPiso = {
    1: [1, 3],     // Goblin LV1 o Bruja LV1
    2: [1, 3],  // Goblin LV1 o Bruja LV1
    3: [2, 3],  // Goblin LV2 o Bruja
    4: [2, 3],  
    5: [3]      // Solo Bruja
};

// Posiciones donde aparecerán según la cantidad
const posicionesPorCantidad = {
    1: [ {fila:2, col:5} ],
    2: [ {fila:2, col:5}, {fila:2, col:6} ],
    3: [ {fila:2, col:5}, {fila:2, col:6}, {fila:2, col:7} ],
    4: [ {fila:2, col:5}, {fila:2, col:6}, {fila:2, col:7}, {fila:2, col:4} ]
};

function generarEnemigosParaPiso(piso) {

    // 1) Cantidad de enemigos
    let cantidad;
    if (piso === 1) {
        cantidad = 1; // piso 1 siempre 1 enemigo
    } else {
        cantidad = Math.floor(Math.random() * 4) + 1; // 1–4 enemigos
    }

    // 2) Qué enemigos pueden aparecer en este piso
    const listaIDs = enemigosPorPiso[piso];

    let enemigosGenerados = [];

    for (let i = 0; i < cantidad; i++) {

        // elegir un enemigo random de la lista del piso
        const idElegido = listaIDs[Math.floor(Math.random() * listaIDs.length)];

        // buscar el enemigo en tabla base
        const base = enemigos.find(e => e.id === idElegido);

        // clonar
        const nuevo = JSON.parse(JSON.stringify(base));

        // ------------------------------
        // ⭐ NUEVA LÓGICA DE UBICACIÓN  
        // ------------------------------

        nuevo.fila = 2; // SIEMPRE en la fila 2

        if (nuevo.clase === "guerrero") {
            nuevo.col = 5;
        }
        else if (nuevo.clase === "hechicero") {
            nuevo.col = 7;
        }
        else {
            // por si agregás otras clases en el futuro
            nuevo.col = 6;
        }

        enemigosGenerados.push(nuevo);
    }

    return enemigosGenerados;
}

//------------------------------------------------------------------------------------------------------------------------------------
// Tarjetas de los jugadores en Batalla:

function mostrarTarjetasJugadoresEnBatalla() {
    const contenedor = document.getElementById("infoJugadoresEnBatalla");
    contenedor.innerHTML = ""; // Limpia antes de generar

    // Filtrar jugadores activos y no muertos
    const jugadoresEnBatalla = jugadores.filter(j =>
        j.activo === true && j.estado !== 2
    );

    jugadoresEnBatalla.forEach(jugador => {

        // Crear tarjeta principal
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-jugador");

        // Imagen del icono
        const img = document.createElement("img");
        img.src = jugador.imgIcono;
        img.classList.add("icono-jugador");

        // Contenedor derecho
        const info = document.createElement("div");
        info.classList.add("info-jugador");

        // --- PV ---
        const filaPV = document.createElement("div");
        filaPV.classList.add("fila-texto");
        filaPV.textContent = `PV: ${jugador.pv}/${jugador.pvMax}`;

        const barraPV = document.createElement("div");
        barraPV.classList.add("barra-outer");
        const barraPVInner = document.createElement("div");
        barraPVInner.classList.add("barra-inner", "vida");
        barraPVInner.style.width = `${(jugador.pv / jugador.pvMax) * 100}%`;
        barraPV.appendChild(barraPVInner);

        // --- PM ---
        const filaPM = document.createElement("div");
        filaPM.classList.add("fila-texto");
        filaPM.textContent = `PM: ${jugador.pm}/${jugador.pmMax}`;

        const barraPM = document.createElement("div");
        barraPM.classList.add("barra-outer");
        const barraPMInner = document.createElement("div");
        barraPMInner.classList.add("barra-inner", "mana");
        barraPMInner.style.width = `${(jugador.pm / jugador.pmMax) * 100}%`;
        barraPM.appendChild(barraPMInner);

        // Agregar elementos a la parte derecha
        info.appendChild(filaPV);
        info.appendChild(barraPV);
        info.appendChild(filaPM);
        info.appendChild(barraPM);

        // Juntar todo en la tarjeta
        tarjeta.appendChild(img);
        tarjeta.appendChild(info);

        // Agregar tarjeta al contenedor
        contenedor.appendChild(tarjeta);
    });
}


//------------------------------------------------------------------------------------------------------------------------------------
function crearTablero() {
    const filas = 3;
    const columnas = 7;
    const tableroDiv = document.getElementById("tableroReal");

    tableroDiv.innerHTML = "";
    tableroDiv.className = "tableroGuerra";

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            const celda = document.createElement("div");
            celda.classList.add("celdaGuerra");
            celda.dataset.fila = fila;
            celda.dataset.columna = col;

            tableroDiv.appendChild(celda);
        }
    }

    mostrarTarjetasJugadoresEnBatalla()
}

function colocarJugadoresEnTablero() {
    jugadores.forEach(j => {
        if (!j.activo) return;

        // Usa posicionesEnPelea durante la batalla; si es null, usa la formación persistente
        const pos = (posicionesEnPelea && posicionesEnPelea[j.id]) ? posicionesEnPelea[j.id] : posicionesFormacion[j.id];
        if (!pos) return;

        const filaTab = pos.fila - 1;
        const colTab = pos.col - 1;

        const celda = document.querySelector(
            `.celdaGuerra[data-fila="${filaTab}"][data-columna="${colTab}"]`
        );

        if (!celda) return;

        const img = document.createElement("img");
        img.src = j.img;
        img.className = "imgPersonaje";

        img.style.zIndex = 10 + filaTab;

        celda.innerHTML = "";
        celda.appendChild(img);
    });
}

function iniciarTablero() {
    actualizarPiso();
    crearTablero();
    colocarJugadoresEnTablero(); // ← SIEMPRE LEE posicionesFormacion EN TIEMPO REAL
}

// ==========================================================
// INICIAR TABLERO DE GUERRA
// ==========================================================

let enemigosActuales = []; // lista de enemigos en esta pelea

function iniciarPelea() {
    console.log("Buscando pelea en el piso:", piso);

    // generar enemigos
    enemigosActuales = generarEnemigosParaPiso(piso);

    // Crear copia profunda de la formación persistente para usar durante la pelea
    posicionesEnPelea = JSON.parse(JSON.stringify(posicionesFormacion));

    // preparar tablero y ubicar entidades usando posicionesEnPelea
    iniciarTablero();
    colocarEnemigosEnTablero();

    // calcular y mostrar orden de turnos
    ordenTurnos = calcularOrdenTurnos(jugadores, enemigosActuales);
    indiceTurno = 0;
    mostrarOrdenTurnos(ordenTurnos);
}

function colocarEnemigosEnTablero() {
    enemigosActuales.forEach(e => {

        const filaTab = e.fila - 1;
        const colTab = e.col - 1;

        const celda = document.querySelector(
            `.celdaGuerra[data-fila="${filaTab}"][data-columna="${colTab}"]`
        );

        if (!celda) return;

        const img = document.createElement("img");
        img.src = e.img;
        img.className = "imgPersonaje";

        // Para asegurar que los enemigos queden detrás o delante si querés ordenar por fila
        img.style.zIndex = 10 + filaTab;

        // Vaciar celda primero (aunque no debería haber nada)
        celda.innerHTML = "";
        celda.appendChild(img);
    });
}

//------------------------------------------------------------------------------------------------------------------------------
//Ordenando quien ataca primero:

function calcularOrdenTurnos(jugadores, enemigos) {

    // 1. Obtener jugadores activos
    const jugadoresActivos = jugadores
        .filter(j => j.activo)
        .map(j => ({
            tipo: "jugador",
            velocidad: Number(j.velocidad) || 0,
            imgIcono: j.imgIcono,
            id: j.id
        }));

    // 2. Obtener enemigos del combate actual
    const enemigosActivos = enemigos.map(e => ({
        tipo: "enemigo",
        velocidad: Number(e.velocidad) || 0,
        imgIcono: e.imgIcono,
        id: e.id
    }));

    // 3. Unir listas
    const todos = [...jugadoresActivos, ...enemigosActivos];

    // 4. Ordenar:
    //    - Primero mayor velocidad
    //    - Si velocidad es igual → jugador antes que enemigo
    todos.sort((a, b) => {

        // Orden por velocidad
        if (b.velocidad !== a.velocidad) {
            return b.velocidad - a.velocidad;
        }

        // Si tienen misma velocidad → jugador primero
        if (a.tipo === "jugador" && b.tipo === "enemigo") return -1;
        if (a.tipo === "enemigo" && b.tipo === "jugador") return 1;

        return 0;
    });

    return todos;
}

function mostrarOrdenTurnos(listaTurnos) {
    const contenedor = document.getElementById("mostrandoTurnos");
    contenedor.innerHTML = ""; // limpiar

    // Guardamos la cola en ordenTurnos (asegura coincidencia)
    ordenTurnos = Array.isArray(listaTurnos) ? [...listaTurnos] : [];

    ordenTurnos.forEach(ent => {
        const img = document.createElement("img");
        img.src = ent.imgIcono;
        img.className = "iconoTurno";
        contenedor.appendChild(img);
    });
}

function eliminarIconoTurnoActual() {
    const contenedor = document.getElementById("mostrandoTurnos");
    if (!contenedor) return;

    // Siempre quitar el primer hijo (la cabeza de la cola)
    if (contenedor.firstElementChild) {
        contenedor.removeChild(contenedor.firstElementChild);
    }
}

//----------------------------------------------------------------------------------------------------------
// TURNOS:
//------------------------------

let ordenTurnos = [];
let indiceTurno = 0;

function iniciarPelea() {
    console.log("Buscando pelea en el piso:", piso);

    // --- REINICIAR VARIABLES DE PELEA ---
    posicionesEnPelea = null; // borrar formación temporal anterior
    posicionesEnPelea = JSON.parse(JSON.stringify(posicionesFormacion)); // nueva copia fresca

    // Reactivar botones al empezar nueva pelea
    const btnMover = document.getElementById("btnMover");
    const btnAcabar = document.getElementById("btnAcabarTurno");
    if (btnMover) btnMover.disabled = false;
    if (btnAcabar) btnAcabar.disabled = false;

    // Generar enemigos y preparar tablero
    enemigosActuales = generarEnemigosParaPiso(piso);

    iniciarTablero();
    colocarEnemigosEnTablero();

    // Inicializar orden de turnos (cola)
    ordenTurnos = calcularOrdenTurnos(jugadores, enemigosActuales);
    mostrarOrdenTurnos(ordenTurnos);

    // arrancar ronda
    numeroRonda = 1;
    const textoRonda = document.getElementById("rondaTexto");
    if (textoRonda) textoRonda.textContent = "Ronda 1";

    ejecutarTurnoActual();
}

// Saber si es turno de un jugador:
function obtenerEntidadEnTurno() {
    // ahora el primer elemento de la cola es quien actúa
    return ordenTurnos && ordenTurnos.length ? ordenTurnos[0] : null;
}


function esTurnoJugador() {
    return obtenerEntidadEnTurno()?.tipo === "jugador";
}

function avanzarTurno() {
    // 1) Remover icono visual del que ya jugó
    eliminarIconoTurnoActual();

    // 2) Sacar la cabeza de la cola lógica
    if (ordenTurnos.length) ordenTurnos.shift();

    // 3) Verificar si quedó alguien en la cola
    const contenedor = document.getElementById("mostrandoTurnos");
    if (!contenedor || contenedor.children.length === 0 || ordenTurnos.length === 0) {
        iniciarNuevaRonda();
        return;
    }

    // 4) Ejecutar siguiente
    ejecutarTurnoActual();
}

function ejecutarTurnoActual() {
    const entidad = obtenerEntidadEnTurno();
    if (!entidad) return;

    if (entidad.tipo === "jugador") {
        // Habilitar controles del jugador
        const btnMover = document.getElementById("btnMover");
        const btnAcabar = document.getElementById("btnAcabarTurno");
        if (btnMover) btnMover.disabled = false;
        if (btnAcabar) btnAcabar.disabled = false;
    } else {
        // Deshabilitar controles de jugador mientras la IA actúa
        const btnMover = document.getElementById("btnMover");
        const btnAcabar = document.getElementById("btnAcabarTurno");
        if (btnMover) btnMover.disabled = true;
        if (btnAcabar) btnAcabar.disabled = true;

        // Ejecutar IA (con pequeño delay para sensación de turno)
        setTimeout(() => {
            moverEnemigoIA(entidad.id);

            // Después de la acción del enemigo, avanzamos el turno
            avanzarTurno();
        }, 350);
    }
}

// Cuando se apreta el boton ACABAR TURNO:
document.getElementById("btnAcabarTurno").addEventListener("click", () => {
    if (!esTurnoJugador()) return;

    avanzarTurno();
});

// Iniciar NUEVA RONDA
function iniciarNuevaRonda() {
    numeroRonda++;

    const textoRonda = document.getElementById("rondaTexto");
    if (textoRonda) {
        textoRonda.textContent = "Ronda " + numeroRonda;
    }

    // Recalcular orden (por si hubo cambios de velocidad)
    ordenTurnos = calcularOrdenTurnos(jugadores, enemigosActuales);

    // Redibujar la barra de turnos
    mostrarOrdenTurnos(ordenTurnos);

    // Empezar la ronda
    ejecutarTurnoActual();
}

//----------------------------------------------------------------------------
// Boton MOVER:

document.getElementById("btnMover").addEventListener("click", () => {
    if (!esTurnoJugador()) return;

    iniciarMovimientoJugador();
});

// Revisa si el casillero contiguo está ocupado:
function estaOcupada(fila, col) {
    // Revisar jugadores:
    for (const j of jugadores) {
        if (!j.activo) continue;
        const p = posicionesEnPelea[j.id];
        if (p && p.fila === fila && p.col === col) return true;
    }

    // Revisar enemigos:
    for (const e of enemigosActuales) {
        if (e.fila === fila && e.col === col) return true;
    }

    return false;
}

// Iniciar Movimiento:
let celdasHabilitadas = [];
let movimientoEnCurso = false;

function iniciarMovimientoJugador() {
    if (movimientoEnCurso) return;
    movimientoEnCurso = true;

    const entidad = obtenerEntidadEnTurno();
    const jugador = jugadores.find(j => j.id === entidad.id);

    const pos = (posicionesEnPelea && posicionesEnPelea[jugador.id]) ? posicionesEnPelea[jugador.id] : posicionesFormacion[jugador.id];

    const fila = pos.fila - 1;
    const col = pos.col - 1;

    const posibles = [
        { f: fila - 1, c: col },     // arriba
        { f: fila + 1, c: col },     // abajo
        { f: fila, c: col - 1 },     // izquierda
        { f: fila, c: col + 1 }      // derecha
    ];

    // Filtrar posiciones válidas dentro del tablero 3x7 y no ocupadas
    const validas = posibles.filter(p =>
        p.f >= 0 && p.f < 3 &&
        p.c >= 0 && p.c < 7 &&
        !estaOcupada(p.f + 1, p.c + 1)  // convertir a formato 1-based
    );

    // Resaltar celdas
    celdasHabilitadas = validas.map(p => {
        const celda = document.querySelector(
            `.celdaGuerra[data-fila="${p.f}"][data-columna="${p.c}"]`
        );

        celda.classList.add("celda-movible");
        celda.addEventListener("click", moverJugadorClick);

        return celda;
    });

    // Click fuera → cancelar
    document.addEventListener("click", cancelarMovimientoClickFuera, true);
}

// Al hacer click en un CASILLERO VALIDO:
function moverJugadorClick(event) {
    event.stopPropagation();

    const celda = event.currentTarget;
    const filaNueva = Number(celda.dataset.fila);
    const colNueva = Number(celda.dataset.columna);

    const entidad = obtenerEntidadEnTurno();
    const jugador = jugadores.find(j => j.id === entidad.id);

    // --- ACTUALIZAMOS SOLO la copia de pelea ---
    if (!posicionesEnPelea) posicionesEnPelea = JSON.parse(JSON.stringify(posicionesFormacion));
    posicionesEnPelea[jugador.id] = {
        fila: filaNueva + 1,
        col: colNueva + 1
    };

    // Redibujar tablero usando posicionesEnPelea
    iniciarTablero();
    colocarEnemigosEnTablero();

    finalizarMovimiento(true);
}

// Click Afuera > CANCELAR:
function cancelarMovimientoClickFuera(event) {

    // Si hizo click en una celda movible, no cancelamos
    if (event.target.classList.contains("celda-movible")) return;

    finalizarMovimiento(false);
}

// Finalizar movimiento:
function finalizarMovimiento(seMovio) {

    // Quitar resaltados y listeners
    celdasHabilitadas.forEach(c => {
        c.classList.remove("celda-movible");
        c.removeEventListener("click", moverJugadorClick);
    });

    celdasHabilitadas = [];
    movimientoEnCurso = false;

    document.removeEventListener("click", cancelarMovimientoClickFuera, true);

    if (seMovio) {
        // Bloquear botón mover
        document.getElementById("btnMover").disabled = true;
    }
}

//-------------------------------------------------------------------------------

// TURNO DE LA CPU de MOVERSE:
function moverEnemigoIA(idEnemigo) {
    const enemigo = enemigosActuales.find(e => e.id === idEnemigo);
    if (!enemigo) return;

    // Buscar jugador más cercano
    let jugadorCercano = null;
    let mejorDist = Infinity;

    for (const j of jugadores) {
        if (!j.activo) continue;

        const posJ = posicionesEnPelea[j.id];
        if (!posJ) continue;

        const d = Math.abs(posJ.fila - enemigo.fila) + Math.abs(posJ.col - enemigo.col);

        if (d < mejorDist) {
            mejorDist = d;
            jugadorCercano = j;
        }
    }

    if (!jugadorCercano) return;

    const target = posicionesEnPelea[jugadorCercano.id];
    const distActual = Math.abs(target.fila - enemigo.fila) + Math.abs(target.col - enemigo.col);

    // Si está a distancia 1: normalmente NO se mueve, excepto si es un hechicero (el hechicero debe intentar escapar).
    if (distActual === 1) {
        // permitir que los hechiceros sigan con su lógica de evasión
        const esHechicero = enemigo.clase && enemigo.clase.toString().toLowerCase() === "hechicero";
        if (!esHechicero) {
            iniciarTablero();
            colocarEnemigosEnTablero();
            return;
        }
        // si es hechicero -> no retornamos aquí, dejamos que la lógica específica del hechicero intente moverlo fuera de la adyacencia.
    }

    // ------------------------------------------------------------
    // Hechicero Inteligente: mantiene distancia mínima, evita distancia 1,
    // y si está arrinconado siempre intenta moverse a la mejor casilla posible
    // ------------------------------------------------------------
    if (enemigo.clase && enemigo.clase.toString().toLowerCase() === "hechicero") {

        const distanciaMinima = 2;

        const candidatos = [
            { f: enemigo.fila, c: enemigo.col },         // quedarse
            { f: enemigo.fila - 1, c: enemigo.col },     // arriba
            { f: enemigo.fila + 1, c: enemigo.col },     // abajo
            { f: enemigo.fila, c: enemigo.col - 1 },     // izq
            { f: enemigo.fila, c: enemigo.col + 1 }      // der
        ];

        const candidatosValidos = candidatos.filter(m => {
            const dentro = m.f >= 1 && m.f <= 3 && m.c >= 1 && m.c <= 7;
            if (!dentro) return false;

            // Si es su propia casilla, siempre se permite
            if (m.f === enemigo.fila && m.c === enemigo.col) return true;

            return !estaOcupada(m.f, m.c);
        });

        const target = posicionesEnPelea[jugadorCercano.id];
        const distActual = Math.abs(target.fila - enemigo.fila) + Math.abs(target.col - enemigo.col);

        // Evaluar todos
        const evaluados = candidatosValidos.map(m => {
            const dist = Math.abs(target.fila - m.f) + Math.abs(target.col - m.c);
            return { m, dist };
        });

        // --------------------------------------------
        // 1) Movimientos ideales: distancia >= mínima y sin quedar a 1
        // --------------------------------------------
        let ideales = evaluados.filter(o =>
            o.dist >= distanciaMinima && o.dist !== 1
        );

        if (ideales.length > 0) {
            ideales.sort((a, b) => b.dist - a.dist);
            enemigo.fila = ideales[0].m.f;
            enemigo.col = ideales[0].m.c;
            iniciarTablero();
            colocarEnemigosEnTablero();
            return;
        }

        // --------------------------------------------
        // 2) Movimientos seguros: evitar distancia 1 aunque no lleguen a la mínima
        // --------------------------------------------
        let seguros = evaluados.filter(o => o.dist !== 1);

        if (seguros.length > 0) {
            // Elegimos el que más distancia dé
            seguros.sort((a, b) => b.dist - a.dist);
            enemigo.fila = seguros[0].m.f;
            enemigo.col = seguros[0].m.c;
            iniciarTablero();
            colocarEnemigosEnTablero();
            return;
        }

        // --------------------------------------------
        // 3) Última opción (acorralado total):
        //    TODAS las casillas permiten distancia 1
        //    → Elegir la de mayor distancia igualmente (simula escape)
        // --------------------------------------------
        evaluados.sort((a, b) => b.dist - a.dist);
        enemigo.fila = evaluados[0].m.f;
        enemigo.col = evaluados[0].m.c;

        iniciarTablero();
        colocarEnemigosEnTablero();
        return;
    }

    // ============================================================
    // 3) ENEMIGOS NORMALES → acercarse
    // ============================================================
    const movimientos = [
        { f: enemigo.fila - 1, c: enemigo.col }, // arriba
        { f: enemigo.fila + 1, c: enemigo.col }, // abajo
        { f: enemigo.fila, c: enemigo.col - 1 }, // izquierda
        { f: enemigo.fila, c: enemigo.col + 1 }  // derecha
    ];

    let mejorMovimiento = null;
    let mejorDistFinal = distActual;

    for (const m of movimientos) {
        // dentro del tablero
        if (m.f < 1 || m.f > 3 || m.c < 1 || m.c > 7) continue;

        // evitar posiciones ocupadas
        if (estaOcupada(m.f, m.c)) continue;

        const nuevaDist = Math.abs(target.fila - m.f) + Math.abs(target.col - m.c);

        // Elegir la casilla que acerque al jugador
        if (nuevaDist < mejorDistFinal) {
            mejorDistFinal = nuevaDist;
            mejorMovimiento = m;
        }
    }

    // Si encontró movimiento válido que acerque → moverse
    if (mejorMovimiento) {
        enemigo.fila = mejorMovimiento.f;
        enemigo.col = mejorMovimiento.c;
    }

    iniciarTablero();
    colocarEnemigosEnTablero();
}

//---------------------------------------------------------------------------------------------------
// MENU DE ATACAR E ITEMS:
//---------------------------------------------------------------------------------------------------

// Referencias a los dos menús
const miniMenu1 = document.getElementById("miniMenu_1");
const miniMenu2 = document.getElementById("miniMenu_2");

const btnRealizarAccion = document.getElementById("btnRealizarAccion");
const btnRegresar = document.getElementById("btnRegresar");

// Mostrar submenu (Atacar / Usar item / Regresar)
btnRealizarAccion.addEventListener("click", () => {
    miniMenu1.style.display = "none";
    miniMenu2.style.display = "grid";  // <-- respetamos el grid
});

// Regresar al menú principal
btnRegresar.addEventListener("click", () => {
    miniMenu2.style.display = "none";
    miniMenu1.style.display = "grid";  // <-- respetamos el grid
});








//-----------------------------------------------------------------------

// Cuando acaba la pelea (ya sea que gana o huya):

function finalizarPelea(resultado) {
    // Reset general de la pelea
    posicionesEnPelea = null;
    enemigosActuales = [];

    // Reactivar controles por seguridad
    const btnMover = document.getElementById("btnMover");
    const btnAcabar = document.getElementById("btnAcabarTurno");
    if (btnMover) btnMover.disabled = false;
    if (btnAcabar) btnAcabar.disabled = false;

    // Limpiar la cola visual y lógica
    const contenedor = document.getElementById("mostrandoTurnos");
    if (contenedor) contenedor.innerHTML = "";
    ordenTurnos = [];
}







































// ==========================================================
// SUMA +30 de EXP y PROBAMOS SI SUBE DE NIVEL (USANDO agregarExp)
// ==========================================================
document.getElementById("btnTesteo").addEventListener("click", function () {
    const pj = jugadores[0]; // jugador 1
    if (!pj) {
        console.error("No existe jugadores[0]");
        return;
    }

    // Normalizar: soporta tanto .exp como .experiencia (legacy)
    if (typeof pj.exp !== "number") {
        pj.exp = (typeof pj.experiencia === "number") ? pj.experiencia : 0;
    }

    // Sumar 30 EXP (usa la función única y correcta)
    agregarExp(pj, 30);

    console.log("EXP actual:", pj.exp);
    console.log("Nivel actual:", pj.nivel, "PVMax:", pj.pvMax, "PMMax:", pj.pmMax, "Puntos:", pj.puntosDisponibles);

    // Refrescar UI (si tienes estas funciones)
    if (typeof actualizarPaginaStatus === "function") actualizarPaginaStatus();
    if (typeof actualizarPaginaMejoras === "function") actualizarPaginaMejoras();
});
