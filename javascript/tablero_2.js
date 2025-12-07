

// ==========================================================
// PERSONAJES (definición de datos)
// ==========================================================
const jugadores = [
    crearPersonaje({
        id: 1, 
        nombre: "Héroe", 
        tipo: "jugador",
        nivel: 1, 
        pv: 22,
        pvMax: 22, 
        pm: 6, 
        pmMax: 6,
        fuerza: 3, 
        poderMagico: 0,
        defensa: 0, 
        defensaMagica: 0, 
        velocidad: 2,
        img: "imgs/javi.png",
        ataquesAprendidosNum: [1, 2, 5]
    }),
    crearPersonaje({
        id: 2, 
        nombre: "Benja", 
        tipo: "jugador",
        nivel: 1, 
        pv: 15, 
        pvMax: 15,
        pm: 20, 
        pmMax: 20,
        fuerza: 2, 
        poderMagico: 3,
        defensa: 0, 
        defensaMagica: 0, 
        velocidad: 1,
        img: "imgs/benja.png",
        ataquesAprendidosNum: [1]
    }),
    crearPersonaje({
        id: 3, 
        nombre: "Jaz", 
        tipo: "jugador",
        nivel: 1, 
        pv: 13, 
        pvMax: 13,
        pm: 15, 
        pmMax: 13,
        fuerza: 1, 
        poderMagico: 3,
        defensa: 0, 
        defensaMagica: 0, 
        velocidad: 1,
        img: "imgs/jaz.png",
        ataquesAprendidosNum: [2]
    })
];

const enemigos = [
    crearPersonaje({
        id: 1, 
        nombre: "Goblin", 
        tipo: "enemigo",
        nivel: 1, 
        pv: 8,
        pvMax: 8, 
        pm: 0, 
        pmMax: 0,
        fuerza: 2, 
        poderMagico: 0,
        defensa: 0, 
        defensaMagica: 0, 
        velocidad: 1,
        img: "imgs/goblinPalo.png",
        ataquesAprendidosNum: [3]
    }),
    crearPersonaje({
        id: 2, 
        nombre: "Goblin", 
        tipo: "enemigo",
        nivel: 2, 
        pv: 11, 
        pvMax: 11,
        pm: 0, 
        pmMax,
        fuerza: 2, 
        poderMagico: 0,
        defensa: 0, 
        defensaMagica: 0, 
        velocidad: 2,
        img: "imgs/goblinPalo.png",
        ataquesAprendidosNum: [3]
    }),
    crearPersonaje({
        id: 3, 
        nombre: "Bruja", 
        tipo: "enemigo",
        nivel: 1, 
        pv: 8, 
        pvMax: 8,
        pm: 15, 
        pmMax: 15,
        fuerza: 1, 
        poderMagico: 3,
        defensa: 0, 
        defensaMagica: 0, 
        velocidad: 1,
        img: "imgs/bruja.png",
        ataquesAprendidosNum: [1, 4, 6]
    })
];

// ==========================================================
// PERSONAJES ACTIVOS
// - El héroe (jugadores[0]) siempre está activo (visible).
// - Los demás estarán desactivados por ahora.
// ==========================================================
let party = [ jugadores[0] ]; // solo el héroe visible/activo al inicio
let enemigosEnBatalla = [ enemigos[0] ]; // por defecto 1 enemigo en combate

// ==========================================================
// ATAQUES QUE EXISTEN EN TOTAL
// ==========================================================
const ataquesDisponibles = [
    {
        ataqueNum: 1,
        nombre: "Ataque Básico",
        tipo: "Ataque_al_Cuerpo",
        pmNecesaria: 0,
        dano: 3,
        detalle: "Ataca al enemigo que está a 1 casillero.",
        target: "Rival"
    },
    {
        ataqueNum: 2,
        nombre: "Mini Curación",
        tipo: "Curacion",
        pmNecesaria: 2,
        dano: 0,
        curacion: 4,
        detalle: "Te cura un poco.",
        target: "Compañero"
    },
    {
        ataqueNum: 3,
        nombre: "Palazo",
        tipo: "Ataque_al_Cuerpo",
        pmNecesaria: 0,
        dano: 2,
        detalle: "Ataca al enemigo que está a 1 casillero.",
        target: "Rival"
    },
    {
        ataqueNum: 4,
        nombre: "Bola de Fuego",
        tipo: "Magia",
        pmNecesaria: 2,
        dano: 0,
        curacion: 4,
        detalle: "Lanza una bola de fuego.",
        target: "Rival"
    },
    {
        ataqueNum: 5,
        nombre: "Revivir",
        tipo: "Curacion",
        pmNecesaria: 4,
        dano: 0,
        curacion: 20,
        precision: 50, //Tiene una probabilidad del 50% de que el conjuro reviva a tu compañero.
        detalle: "Revive a un aliado.",
        target: "compañero"
    },
    {
        ataqueNum: 6,
        nombre: "Bajar Defensa",
        tipo: "Conjuro",
        pmNecesaria: 2,
        dano: 0,
        curacion: 0,
        precision: 80, //Tiene una probabilidad del 80% de que el conjuro haya afectado al enemigo.  
        detalle: "Le baja la defensa al Enemigo",
        target: "Rival"
    }
];

// Dado un personaje, devuelve la lista de objetos ataque que conoce
function obtenerAtaquesDe(personaje) {
    if (!personaje || !personaje.ataquesAprendidosNum) return [];
    return personaje.ataquesAprendidosNum.map(num =>
        ataquesDisponibles.find(a => a.ataqueNum === num) || null
    );
}

// ==========================================================
// ELEMENTOS DOM (cacheo)
// ==========================================================
const tablero = document.getElementById("tablero");
const tileWidth = Math.floor(tablero.clientWidth / 7); // columnas por defecto 7
const tileHeight = Math.floor(tablero.clientHeight / 3); // filas por defecto 3

const btnMover = document.getElementById("btnMover");
const btnAtacar = document.getElementById("btnAtacar");
const btnAcabarTurno = document.getElementById("btnAcabarTurno");
const btnHuir = document.getElementById("btnHuir");

const accionTexto = document.getElementById("accionTexto");
const turnoTexto = document.getElementById("turnoTexto");

const menuAtaques = document.getElementById("menuAtaques");
const slotIds = ["ataque_1","ataque_2","ataque_3","ataque_4"].map(id => document.getElementById(id));
const btnCancelarAtaque = document.getElementById("btnCancelarAtaque");

const paginaPrincipal = document.getElementById("paginaPrincipal");
const paginaOrganizarAtaques = document.getElementById("paginaOrganizarAtaques");
const paginaTableroDiv = document.getElementById("paginaTablero");
const paginaArmarTactica = document.getElementById("paginaArmarTactica");

const btnOrganizarAtaques = document.getElementById("bntOrganizarAtaques");
const btnBuscarPelea = document.getElementById("btnBuscarPelea");
const listadoAtaquesAprendidos = document.getElementById("listadoAtaquesAprendidos");
const btnGuardarAtaques = document.getElementById("btnGuardarAtaques");
const btnVerTactica = document.getElementById("btnVerTactica");
const btnConfirmarTactica = document.getElementById("btnConfirmarTactica");
const tableroTactico = document.getElementById("tableroTactico");
const colocarHeroeTexto = document.getElementById("colocarHeroeTexto");

// ==========================================================
// TABLERO / POSICIONES (simple sistema de posiciones en grid)
// ==========================================================
const filas = 3;
const columnas = 7;

// posición de "pieza" para jugador y enemigo (coordenadas 1-indexed para tu sistema)
let jugadorPos = { fila: 2, columna: 2 };
let enemigoPos = { fila: 2, columna: 7 };

// posición inicial guardada desde táctica (por defecto la actual)
let posicionInicialHeroe = { ...jugadorPos };

// elementos img en el tablero
let heroeSprite = null;
let goblinSprite = null;

// casilleros de movimiento DOM layers (para limpiar)
let casillerosMarcados = [];

// flags
let turno = "jugador"; // 'jugador' | 'enemigo'
let modoMover = false;
let ataqueMenuAbierto = false;

// ==========================================================
// HISTORIAL (4 líneas)
// ==========================================================
let historialTexto = [];
function agregarTextoHistorial(texto) {
    historialTexto.push(texto);
    if (historialTexto.length > 4) {
        // comportamiento pedido: borrar todo y dejar solo la nueva línea
        historialTexto = [texto];
    }
    accionTexto.innerHTML = historialTexto.join("<br>");
}
function limpiarHistorial() {
    historialTexto = [];
    accionTexto.innerHTML = "";
}

// ==========================================================
// UTIL: crear layer casillero (para movimiento)
// ==========================================================
function crearLayer() {
    const layer = document.createElement("div");
    layer.style.position = "absolute";
    layer.style.width = tileWidth + "px";
    layer.style.height = tileHeight + "px";
    layer.style.zIndex = "2";
    return layer;
}

// ==========================================================
// DIBUJAR / GRILLA
// ==========================================================
function dibujarGrilla() {
    // limpia líneas viejas si hay
    const prevLines = tablero.querySelectorAll(".grid-line");
    prevLines.forEach(n => n.remove());

    // verticales
    for (let c = 1; c < columnas; c++) {
        const vLine = document.createElement("div");
        vLine.classList.add("grid-line");
        vLine.style.left = (c * tileWidth) + "px";
        vLine.style.top = "0";
        vLine.style.width = "2px";
        vLine.style.height = "100%";
        tablero.appendChild(vLine);
    }
    // horizontales
    for (let f = 1; f < filas; f++) {
        const hLine = document.createElement("div");
        hLine.classList.add("grid-line");
        hLine.style.top = (f * tileHeight) + "px";
        hLine.style.left = "0";
        hLine.style.height = "2px";
        hLine.style.width = "100%";
        tablero.appendChild(hLine);
    }
}

// ==========================================================
// COLOCAR SPRITES EN TABLERO
// ==========================================================
function colocarPersonaje(imgSrc, fila, columna, clase = "personaje") {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add(clase);
    img.style.position = "absolute";
    img.style.left = (columna - 1) * tileWidth + tileWidth / 2 + "px";
    img.style.top = (fila - 1) * tileHeight + tileHeight / 2 + "px";
    img.style.transform = "translate(-50%,-50%)";
    tablero.appendChild(img);
    return img;
}

// ==========================================================
// ATAQUE: comprobar alcance (manhattan = 1)
// ==========================================================
function puedeAtacar(aPos, bPos) {
    return Math.abs(aPos.fila - bPos.fila) + Math.abs(aPos.columna - bPos.columna) === 1;
}
function actualizarBotonAtacar() {
    btnAtacar.disabled = !(turno === "jugador" && puedeAtacar(jugadorPos, enemigoPos));
}

// ==========================================================
// MOVIMIENTO: mostrar casilleros ... y click para mover
// ==========================================================
function casilleroDisponible(f, c, quien) {
    if (f < 1 || f > filas || c < 1 || c > columnas) return false;
    // evitar ocupar el casillero del otro
    if (quien === "jugador" && f === enemigoPos.fila && c === enemigoPos.columna) return false;
    if (quien === "enemigo" && f === jugadorPos.fila && c === jugadorPos.columna) return false;
    return true;
}

function mostrarCasillerosMovimiento() {
    limpiarCasilleros();
    // no mostrar casilleros si menu de ataques abierto
    if (ataqueMenuAbierto) return;

    const direcciones = [
        { f: -1, c: 0 },
        { f: 1, c: 0 },
        { f: 0, c: -1 },
        { f: 0, c: 1 }
    ];

    direcciones.forEach(dir => {
        const nf = jugadorPos.fila + dir.f;
        const nc = jugadorPos.columna + dir.c;
        if (!casilleroDisponible(nf, nc, "jugador")) return;

        const layer = crearLayer();
        layer.style.left = (nc - 1) * tileWidth + "px";
        layer.style.top = (nf - 1) * tileHeight + "px";
        layer.classList.add("casilleroMovible");

        // solo activa si no hay menú de ataques abierto
        layer.addEventListener("click", () => {
            if (turno !== "jugador") return;
            if (ataqueMenuAbierto) return; // seguridad
            moverJugador(nf, nc);
        });

        casillerosMarcados.push(layer);
        tablero.appendChild(layer);
    });
}

function limpiarCasilleros() {
    casillerosMarcados.forEach(c => c.remove());
    casillerosMarcados = [];
}

// ==========================================================
// MOVER JUGADOR (actualiza posiciones y sprite)
// ==========================================================
function moverJugador(f, c) {
    if (turno !== "jugador") return;

    jugadorPos.fila = f;
    jugadorPos.columna = c;

    if (heroeSprite) {
        heroeSprite.style.left = (c - 1) * tileWidth + tileWidth / 2 + "px";
        heroeSprite.style.top = (f - 1) * tileHeight + tileHeight / 2 + "px";
    }

    limpiarCasilleros();
    modoMover = false;
    btnMover.disabled = true;

    if (puedeAtacar(jugadorPos, enemigoPos)) {
        actualizarBotonAtacar();
    } else {
        terminarTurno();
    }
}

// ==========================================================
// IA ENEMIGO (simple): mueve hacia el jugador
// ==========================================================
function moverEnemigo() {
    if (turno !== "enemigo") return;

    const dirs = [
        { f: -1, c: 0 },
        { f: 1, c: 0 },
        { f: 0, c: -1 },
        { f: 0, c: 1 }
    ];

    let mejor = null;
    let mejorDist = Math.abs(enemigoPos.fila - jugadorPos.fila) + Math.abs(enemigoPos.columna - jugadorPos.columna);

    for (const d of dirs) {
        const nf = enemigoPos.fila + d.f;
        const nc = enemigoPos.columna + d.c;
        if (!casilleroDisponible(nf, nc, "enemigo")) continue;
        const dist = Math.abs(nf - jugadorPos.fila) + Math.abs(nc - jugadorPos.columna);
        if (dist < mejorDist) {
            mejorDist = dist;
            mejor = { nf, nc };
        }
    }

    if (mejor) {
        enemigoPos.fila = mejor.nf;
        enemigoPos.columna = mejor.nc;
        if (goblinSprite) {
            goblinSprite.style.left = (enemigoPos.columna - 1) * tileWidth + tileWidth / 2 + "px";
            goblinSprite.style.top = (enemigoPos.fila - 1) * tileHeight + tileHeight / 2 + "px";
        }
    }

    if (puedeAtacar(enemigoPos, jugadorPos)) {
        agregarTextoHistorial("El enemigo te atacó.");
        // aquí podrías restar vida
    }

    turno = "jugador";
    turnoTexto.textContent = "Turno del héroe";
    actualizarUIJugador();
}

// ==========================================================
// TURNOS: terminarTurno
// ==========================================================
function terminarTurno() {
    limpiarCasilleros();
    modoMover = false;
    setUIEnabled(false);
    menuAtaques.style.display = "none";
    ataqueMenuAbierto = false;

    if (turno === "jugador") {
        turno = "enemigo";
        turnoTexto.textContent = "Turno del enemigo";
        setTimeout(moverEnemigo, 2500); // 2.5s como pediste
    } else {
        turno = "jugador";
        turnoTexto.textContent = "Turno del héroe";
        actualizarUIJugador();
    }
}

// ==========================================================
// UI helpers
// ==========================================================
function setUIEnabled(enabled) {
    btnMover.disabled = !enabled;
    btnAtacar.disabled = !enabled;
    btnAcabarTurno.disabled = !enabled;
}

function actualizarUIJugador() {
    btnMover.disabled = false;
    btnAcabarTurno.disabled = false;
    actualizarBotonAtacar();
}

// ==========================================================
// MENÚ DE ATAQUES: llenar slots y comportamiento
// ==========================================================
function mostrarMenuAtaques() {
    // cancelar movimiento y limpiar casilleros
    modoMover = false;
    limpiarCasilleros();

    // obtener ataques del héroe activo (party[0])
    const hero = party[0];
    const ataques = obtenerAtaquesDe(hero);

    // mostrar menú
    menuAtaques.style.display = "flex";
    menuAtaques.style.justifyContent = "center"; // por si falta CSS
    ataqueMenuAbierto = true;

    // rellenar 4 slots
    for (let i = 0; i < 4; i++) {
        const slotEl = slotIds[i];
        slotEl.innerHTML = "";
        slotEl.className = ""; // limpiar clases
        if (!ataques[i]) {
            slotEl.textContent = "---";
            slotEl.classList.add("opcionAtaque", "desactivado");
            slotEl.style.pointerEvents = "none";
        } else {
            slotEl.textContent = ataques[i].nombre;
            slotEl.classList.add("opcionAtaque");
            slotEl.style.pointerEvents = "auto";
            // asignar handler
            slotEl.onclick = () => {
                seleccionarAtaque(ataques[i]);
            };
        }
    }

    // Aseguramos centrado del contenido interior:
    const contenido = document.getElementById("menuAtaquesContenido");
    if (contenido) {
        contenido.style.display = "flex";
        contenido.style.flexDirection = "column";
        contenido.style.alignItems = "center";
    }
}

function cerrarMenuAtaques() {
    menuAtaques.style.display = "none";
    ataqueMenuAbierto = false;
    // NOTA: no re-habilitamos casilleros. El usuario debe presionar "Moverse" si quiere volver a verlos.
}

// selección de ataque: registra texto y anima luego termina turno
function seleccionarAtaque(ataque) {
    cerrarMenuAtaques();

    if (ataque.tipo === "Ataque") {
        agregarTextoHistorial(`El héroe usó ${ataque.nombre}. Hizo ${ataque.dano} de daño.`);
        // aplicar daño real a enemigo si implementás stats
    } else if (ataque.tipo === "Curacion") {
        agregarTextoHistorial(`El héroe usó ${ataque.nombre}. Recuperó ${ataque.curacion} de vida.`);
        // aplicar curación a héroe si querés
    } else {
        agregarTextoHistorial(`El héroe usó ${ataque.nombre}.`);
    }

    // Llamar animación si existe, si no simplemente esperar y terminar turno
    if (typeof animarAtaqueHeroe === "function") {
        animarAtaqueHeroe(() => {
            setTimeout(() => terminarTurno(), 2500); // espera 2.5s antes de la IA
        });
    } else {
        setTimeout(() => terminarTurno(), 2500);
    }
}

// cancelar botón
btnCancelarAtaque.addEventListener("click", () => {
    cerrarMenuAtaques();
    limpiarCasilleros(); // seguridad extra
});

// ==========================================================
// EVENTOS UI (botones principales)
// ==========================================================
btnMover.addEventListener("click", () => {
    if (turno !== "jugador") return;
    if (ataqueMenuAbierto) {
        // si está abierto el menú de ataques no permitimos alternar mover
        return;
    }
    if (!modoMover) {
        modoMover = true;
        mostrarCasillerosMovimiento();
    } else {
        modoMover = false;
        limpiarCasilleros();
    }
});

btnAtacar.addEventListener("click", () => {
    if (turno !== "jugador") return;
    if (!puedeAtacar(jugadorPos, enemigoPos)) return;
    mostrarMenuAtaques();
});

btnAcabarTurno.addEventListener("click", () => {
    if (turno !== "jugador") return;
    // pediste que no saque texto al acabar turno, así que solo terminarTurno()
    terminarTurno();
});

// ==========================================================
// PÁGINAS: navegación entre vistas
// ==========================================================
btnHuir.addEventListener("click", () => {
    // volver a principal y limpiar historial
    paginaTableroDiv.style.display = "none";
    paginaPrincipal.style.display = "block";
    limpiarHistorial();
});

btnOrganizarAtaques.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaOrganizarAtaques.style.display = "block";
    renderListadoAtaques();
});

btnGuardarAtaques.addEventListener("click", () => {
    paginaOrganizarAtaques.style.display = "none";
    paginaPrincipal.style.display = "block";
});

btnBuscarPelea.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaTableroDiv.style.display = "block";

    // Reset enemigo(s) a su posicion por defecto
    enemigoPos = { fila: 2, columna: 7 };
    if (goblinSprite) {
        goblinSprite.style.left = (enemigoPos.columna - 1) * tileWidth + tileWidth / 2 + "px";
        goblinSprite.style.top = (enemigoPos.fila - 1) * tileHeight + tileHeight / 2 + "px";
    }

    // Restaurar posición inicial guardada desde táctica
    jugadorPos = { ...posicionInicialHeroe };
    if (heroeSprite) {
        heroeSprite.style.left = (jugadorPos.columna - 1) * tileWidth + tileWidth / 2 + "px";
        heroeSprite.style.top = (jugadorPos.fila - 1) * tileHeight + tileHeight / 2 + "px";
    }

    // limpiar casilleros y poner UI lista
    limpiarCasilleros();
    turno = "jugador";
    turnoTexto.textContent = "Turno del héroe";
    actualizarUIJugador();
});

// render listado de ataques aprendidos (paginaOrganizarAtaques)
function renderListadoAtaques() {
    listadoAtaquesAprendidos.innerHTML = "";
    // mostramos los ataques del héroe (party[0]) de abajo hacia arriba
    const ataques = obtenerAtaquesDe(party[0]).slice().reverse();
    ataques.forEach(a => {
        const div = document.createElement("div");
        if (!a) {
            div.textContent = "--- Slot vacío ---";
        } else {
            if (a.tipo === "Ataque") div.textContent = `${a.nombre} (${a.dano} daño)`;
            else if (a.tipo === "Curacion") div.textContent = `${a.nombre} (cura ${a.curacion})`;
            else div.textContent = a.nombre;
        }
        listadoAtaquesAprendidos.appendChild(div);
    });
}

// ==========================================================
// TÁCTICA: tablero táctico y guardado de posicionInicialHeroe
// ==========================================================
let tacticaPos = { ...posicionInicialHeroe };

function generarTableroTactico() {
    tableroTactico.innerHTML = "";
    const size = 3;
    colocarHeroeTexto.textContent = "Asigna al héroe una posición";

    for (let f = 1; f <= size; f++) {
        for (let c = 1; c <= size; c++) {
            const casilla = document.createElement("div");
            casilla.classList.add("casillaTactica");
            casilla.dataset.fila = f;
            casilla.dataset.columna = c;
            casilla.style.display = "inline-block";
            casilla.style.width = "60px";
            casilla.style.height = "60px";
            casilla.style.border = "1px solid #888";
            casilla.style.margin = "4px";
            casilla.style.verticalAlign = "top";
            casilla.style.position = "relative";

            casilla.addEventListener("click", () => {
                tacticaPos.fila = f;
                tacticaPos.columna = c;
                pintarHeroeEnTactica();
            });

            tableroTactico.appendChild(casilla);
        }
    }
    pintarHeroeEnTactica();
}

function pintarHeroeEnTactica() {
    const viejo = tableroTactico.querySelector("img");
    if (viejo) viejo.remove();
    const tile = tableroTactico.querySelector(`.casillaTactica[data-fila="${tacticaPos.fila}"][data-columna="${tacticaPos.columna}"]`);
    if (!tile) return;
    const icon = document.createElement("img");
    icon.src = jugadores[0].img; // icono del héroe
    icon.style.width = "48px";
    icon.style.position = "absolute";
    icon.style.left = "50%";
    icon.style.top = "50%";
    icon.style.transform = "translate(-50%,-50%)";
    tile.appendChild(icon);
}

btnVerTactica.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaArmarTactica.style.display = "block";
    tacticaPos = { ...posicionInicialHeroe };
    generarTableroTactico();
});

btnConfirmarTactica.addEventListener("click", () => {
    paginaArmarTactica.style.display = "none";
    paginaPrincipal.style.display = "block";
    // Guardar nueva posición inicial del héroe
    posicionInicialHeroe = { ...tacticaPos };
});

// ==========================================================
// ANIMACIONES (opcional): si ya tenés una función externa la puede usar
// Si no, dejamos una simple placeholder
// ==========================================================
function animarAtaqueHeroe(callback) {
    if (!heroeSprite) {
        if (callback) callback();
        return;
    }
    // pequeña "animación" por cambiar opacidad
    const orig = heroeSprite.style.opacity || "1";
    heroeSprite.style.transition = "all 120ms";
    heroeSprite.style.opacity = "0.5";
    setTimeout(() => {
        heroeSprite.style.opacity = orig;
        if (callback) callback();
    }, 360);
}

// ==========================================================
// INICIALIZACIÓN: dibujar tablero y sprites iniciales
// ==========================================================
function inicializarTablero() {
    dibujarGrilla();

    // limpiar sprites previos si los hay
    const prev = tablero.querySelectorAll(".personaje");
    prev.forEach(p => p.remove());

    // colocar héroe (party[0]) en posicionInicialHeroe al inicio
    jugadorPos = { ...posicionInicialHeroe };
    heroeSprite = colocarPersonaje(party[0].img, jugadorPos.fila, jugadorPos.columna, "personaje");

    // colocar primer enemigo de enemigosEnBatalla (si existe)
    enemigoPos = enemigosEnBatalla[0] ? { fila: 2, column: 7, columna: 7 } : { fila: 2, columna: 7 };
    // ensure correct coordinates
    enemigoPos = { fila: 2, columna: 7 };
    goblinSprite = colocarPersonaje(enemigosEnBatalla[0] ? enemigosEnBatalla[0].img : enemigos[0].img, enemigoPos.fila, enemigoPos.columna, "personaje");
}

// ==========================================================
// ARRANQUE
// ==========================================================
inicializarTablero();

// UI estado inicial
turno = "jugador";
turnoTexto.textContent = "Turno del héroe";
btnAtacar.disabled = true;
setUIEnabled(true);

// cuando el usuario redimensione la ventana, opcionalmente re-calcular tile sizes (no implementado aquí)
// ==========================================================
