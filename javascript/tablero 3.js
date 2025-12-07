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
        pmNecesaria: 4,
        precision: 50,
        detalle: "Revive a un aliado.",
        target: "Compañero",
        efecto: {
            tipo: "Revivir",
            cantidad: 20   // Por ejemplo revive con +20 PV
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
    }
];

// -------------------------------------------------------------------------------------------------------------------------------------

// ==========================================================
// FUNCIÓN PARA CREAR PERSONAJES
// ==========================================================
function crearPersonaje(datos) {

    let claseBase = datos.clase ?? "";

    // Eliminamos posible "a" final femenina
    claseBase = claseBase.replace(/a$/i, "");
    // Eliminamos posible "o" final masculina
    claseBase = claseBase.replace(/o$/i, "");

    // Ahora claseBase queda como: "Guerrer", "Hechicer", "Arquero" → lo corregimos:
    const equivalenciasBase = {
        guerrer: "Guerrero",
        hechicer: "Hechicero",
        arquer: "Arquero",
    };

    const claveNormalizada = claseBase.toLowerCase();
    if (equivalenciasBase[claveNormalizada]) {
        claseBase = equivalenciasBase[claveNormalizada];
    }

    let claseMostrada = claseBase;

    if (datos.sexo?.toLowerCase() === "femenino") {
        if (claseBase.endsWith("o")) {
            claseMostrada = claseBase.slice(0, -1) + "a";
        }
    }

    const nombreLower = datos.nombre.toLowerCase();
    const imgIconoGenerado = `imgs/${nombreLower}Icono.png`;

    return {
        sexo: datos.sexo,

        id: datos.id,
        nombre: datos.nombre,
        tipo: datos.tipo,

        claseBase: claseBase, // Para lógica del juego
        clase: claseMostrada, // Para mostrar en pantalla

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

        experiencia: datos.experiencia ?? 0,

        img: datos.img,
        imgIcono: imgIconoGenerado,

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
// PERSONAJES
// ======================================================================
const jugadores = [
    crearPersonaje({
        sexo: "Masculino",
        id: 1,
        nombre: "Javi",
        tipo: "jugador",
        clase: "Guerrero",    // La claseBase quedará "Guerrero"
        nivel: 1,
        pv: 22,
        pvMax: 22,
        pm: 6,
        pmMax: 6,
        fuerza: 3,
        poderMagico: 0,
        defensa: 1,
        defensaMagica: 0,
        velocidad: 2,
        experiencia: 0,
        img: "imgs/javi.png",
        ataquesAprendidosNum: [1, 2, 5],
        inventario: [2],
        armaEquipadx: [8],
        armaduraEquipadx: [4],
        escudoEquipadx: [7],
        cascoEquipadx: [6],
        accesorioEquipadx: []
    }),

    crearPersonaje({
        sexo: "Masculino",
        id: 2,
        nombre: "Benja",
        tipo: "jugador",
        clase: "Hechicero",
        nivel: 1,
        pv: 9,
        pvMax: 15,
        pm: 20,
        pmMax: 20,
        fuerza: 2,
        poderMagico: 3,
        defensa: 0,
        defensaMagica: 1,
        velocidad: 1,
        experiencia: 0,
        img: "imgs/benja.png",
        ataquesAprendidosNum: [1],
        inventario: [],
        armaEquipadx: [],
        armaduraEquipadx: [],
        escudoEquipadx: [],
        cascoEquipadx: [],
        accesorioEquipadx: []
    }),

    crearPersonaje({
        sexo: "Femenino",
        id: 3,
        nombre: "Jaz",
        tipo: "jugador",
        clase: "Hechicero",   // ← Importante: siempre pasar la base
        nivel: 1,
        pv: 13,
        pvMax: 13,
        pm: 15,
        pmMax: 15,
        fuerza: 1,
        poderMagico: 3,
        defensa: 0,
        defensaMagica: 1,
        velocidad: 1,
        experiencia: 0,
        img: "imgs/jaz.png",
        ataquesAprendidosNum: [2],
        inventario: [1, 3, 1],
        armaEquipadx: [],
        armaduraEquipadx: [],
        escudoEquipadx: [],
        cascoEquipadx: [],
        accesorioEquipadx: []
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
        defensa: 1,
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
        pmMax: 0,
        fuerza: 2,
        poderMagico: 0,
        defensa: 2,
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
        defensaMagica: 1,
        velocidad: 1,
        img: "imgs/bruja.png",
        ataquesAprendidosNum: [1, 4, 6]
    })
];

// ====== MARCAR JUGADORES ACTIVOS ======
jugadores[0].activo = true; //Javi
jugadores[1].activo = true; //Benja
jugadores[2].activo = true; //Jaz

// -------------------------------------------------------------------------------------------------------------------------------------

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
        clase: "Guerrero",
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
        clase: "Hechicero",
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
        sexo: "Ambos",
        efecto: { defensa: 1 },
        detalle: "Protege ligeramente contra ataques físicos.",
        precioCompra: 10,
        precioVenta: 7,
        clase: "Todos",
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
});

btnHuir.addEventListener("click", () => {
    if (confirm("¿Desea huir del combate?")) {
        paginaTablero.style.display = "none";
        paginaPrincipal.style.display = "block";
    }
});

// -------------------------------------------------------------------------------------------------------------------------------------

// =====================================================
// SOLAPA INICIAL
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

    document.getElementById("divDerechoCaract").style.display = "flex";
    document.getElementById("divDerechoObjetos").style.display = "none";
    document.getElementById("divDerechoHechizos").style.display = "none";
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

        document.getElementById("divDerechoCaract").style.display = "flex";
        document.getElementById("divDerechoObjetos").style.display = "none";
        document.getElementById("divDerechoHechizos").style.display = "none";

        mostrarEstadisticasDelSeleccionado();
        mostrarEquipamientoDelSeleccionado(); // <-- línea necesaria para actualizar las cajitas
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

        document.getElementById("divDerechoCaract").style.display = "none";
        document.getElementById("divDerechoObjetos").style.display = "flex";
        document.getElementById("divDerechoHechizos").style.display = "none";

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

        document.getElementById("divDerechoCaract").style.display = "none";
        document.getElementById("divDerechoObjetos").style.display = "none";
        document.getElementById("divDerechoHechizos").style.display = "flex";

        actualizarHechizosSegunSeleccion();
    });
}

// =====================================================
// MUSESTRA LAS HABILIDADES DEL JUGADOR SELECCIONADO
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

        tarjeta.innerHTML = `
            <div class="fotoCartaJugador">
                <img src="imgs/${jugador.nombre.toLowerCase()}Icono.png">
            </div>

            <div class="infoCartaJugador">

                <!-- Nombre (left) + Nivel (right) -->
                <div class="filaNombreNivel">
                    <span class="nombreJugador">${jugador.nombre}</span>
                    <span class="nivelJugador">Nivel ${jugador.nivel}</span>
                </div>

                <!-- PV -->
                <div class="lineaStatus">
                    <span class="labelStatus">PV ${jugador.pv}/${jugador.pvMax}</span>
                    <div class="barraContenedor">
                        <div class="barraVida" style="width:${(jugador.pv / jugador.pvMax) * 100}%"></div>
                    </div>
                </div>

                <!-- PM -->
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

// =====================================================
// MUESTRA EL EQUIPAMIENTO DEL JUGADOR SELECCIONADO
// =====================================================

function mostrarEquipamientoDelSeleccionado() {
    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugador = jugadores[tarjeta.dataset.jugadorIndex];
    const slots = ["arma", "armadura", "escudo", "casco", "accesorio"];

    // 1) Limpiar cajitas y listeners antiguos
    slots.forEach(slot => {
        const id = `cajita${capitalize(slot)}Equipada`;
        const oldDiv = document.getElementById(id);
        if (!oldDiv) return;

        const nueva = oldDiv.cloneNode(false); // clon sin listeners ni hijos
        nueva.id = oldDiv.id;
        nueva.className = oldDiv.className; // conserva clases (p. ej. cajitaLoEquipado)
        nueva.innerHTML = capitalize(slot); // texto por defecto
        nueva.style.backgroundImage = "none";
        nueva.style.cursor = "pointer"; // querías pointer siempre
        nueva.style.filter = "brightness(1)";
        oldDiv.parentNode.replaceChild(nueva, oldDiv);
    });

    // 2) Pintar contenido actual y asignar listeners (vacío o con item)
    slots.forEach(slot => {
        const id = `cajita${capitalize(slot)}Equipada`;
        const divCajita = document.getElementById(id);
        if (!divCajita) return;

        const arrayEquipado = jugador[`${slot}Equipadx`];

        if (!arrayEquipado || arrayEquipado.length === 0) {
            // cajita VACÍA: al click debe abrir popup con mensaje "Aca no hay nada"
            divCajita.addEventListener("mouseenter", () => divCajita.style.filter = "brightness(1.3)");
            divCajita.addEventListener("mouseleave", () => divCajita.style.filter = "brightness(1)");
            divCajita.addEventListener("click", () => {
                abrirPopupEquipamiento(jugador, slot, null); // item = null -> mensaje vacío
            });
            return;
        }

        // cajita CON ITEM
        const itemId = arrayEquipado[0];
        const item = items.find(i => i.itemId === itemId);
        if (!item) {
            divCajita.textContent = "Sin nada equipado";
            return;
        }

        // Mostrar imagen del item
        divCajita.innerHTML = "";
        divCajita.style.backgroundImage = `url('${item.img}')`;
        divCajita.style.backgroundSize = "cover";
        divCajita.style.backgroundPosition = "center";

        // hover y click para abrir popup con item
        divCajita.addEventListener("mouseenter", () => divCajita.style.filter = "brightness(1.3)");
        divCajita.addEventListener("mouseleave", () => divCajita.style.filter = "brightness(1)");
        divCajita.addEventListener("click", () => {
            abrirPopupEquipamiento(jugador, slot, item); // item no nulo
        });
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// =====================================================
// POPUP DE EQUIPAMIENTO (REEMPLAZAR POR COMPLETO)
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
        // buscar último índice undefined
        let ultimoLibre = -1;
        for (let i = 0; i < jug.inventario.length; i++) {
            if (jug.inventario[i] === undefined) ultimoLibre = i;
        }
        if (ultimoLibre !== -1) jug.inventario[ultimoLibre] = itemId;
        else jug.inventario.push(itemId);
    }

    // ---------- reset visual / handlers ----------
    if (contExtra) { contExtra.innerHTML = ""; contExtra.style.display = "none"; }
    const prevMsg = ventana.querySelector("#popupMensajeHab");
    if (prevMsg) prevMsg.remove();

    // Asegurar botones existentes
    if (btnDesequipar) safeShow(btnDesequipar);
    if (btnTraspasar) safeShow(btnTraspasar);
    if (btnTirar) safeShow(btnTirar);
    if (btnCerrar) safeShow(btnCerrar);

    // Limpiar handlers previos
    clearHandler(btnDesequipar);
    clearHandler(btnTraspasar);
    clearHandler(btnTirar);
    clearHandler(btnCerrar);
    fondo.onclick = null;

    const slotArray = `${slot}Equipadx`;

    // =====================================================
    // SLOT VACÍO → solo mensaje "Aca no hay nada" + CERRAR
    // =====================================================
    if (!item) {
        const mensaje = document.createElement("div");
        mensaje.id = "popupMensajeHab";
        mensaje.style.marginBottom = "10px";
        mensaje.textContent = "Aca no hay nada";
        ventana.insertBefore(mensaje, ventana.firstChild);

        // ocultar opciones irrelevantes
        if (btnDesequipar) safeHide(btnDesequipar);
        if (btnTraspasar) safeHide(btnTraspasar);
        if (btnTirar) safeHide(btnTirar);

        // Cerrar
        if (btnCerrar) btnCerrar.onclick = () => cerrarPopupEquipamiento();
        fondo.onclick = e => { if (e.target === fondo) cerrarPopupEquipamiento(); };

        fondo.style.display = "flex";
        return;
    }

    // =====================================================
    // HAY ITEM EQUIPADO: lógica para Desequipar / Traspasar / Tirar / Cerrar
    // =====================================================
    const itemId = item.itemId;

    // DESEQUIPAR -> mover al ultimo lugar libre del inventario del mismo jugador
    if (btnDesequipar) {
        btnDesequipar.onclick = () => {
            // comprobar que el item siga en el slot
            if (jugador[slotArray] && jugador[slotArray][0] === itemId) {
                // compactar primero para mantener consistencia (por si hay undefined)
                if (typeof compactarInventario === "function") compactarInventario(jugador);

                // liberar slot
                jugador[slotArray] = [];

                // agregar al inventario en último lugar libre
                agregarAlUltimoLugar(jugador, itemId);
            }

            cerrarPopupEquipamiento();
            mostrarEquipamientoDelSeleccionado();
            const solapa = document.querySelector(".solapa.activa")?.dataset?.tab;
            if (solapa === "objetos" && typeof actualizarInventarioSegunSeleccion === "function") {
                actualizarInventarioSegunSeleccion();
            }
        };
    }

    // TRASPASAR -> mostrar SOLO lista de compañeros (sin Cerrar ni otras opciones)
    if (btnTraspasar) {
        btnTraspasar.onclick = () => {

            // Ocultar botones principales (incluido cerrar)
            if (btnDesequipar) safeHide(btnDesequipar);
            if (btnTraspasar) safeHide(btnTraspasar);
            if (btnTirar) safeHide(btnTirar);
            if (btnCerrar) safeHide(btnCerrar);

            // Mostrar contenedor extra
            if (contExtra) { contExtra.innerHTML = ""; contExtra.style.display = "block"; }

            // Lista de compañeros activos
            const otros = jugadores.filter(j => j !== jugador && j.activo);

            if (!contExtra) return;

            if (otros.length === 0) {
                const aviso = document.createElement("div");
                aviso.classList.add("popupOpcionHab");
                aviso.textContent = "No hay compañeros activos.";
                contExtra.appendChild(aviso);

                // Agregar botón Volver para restaurar el menú
                const volverSolo = document.createElement("div");
                volverSolo.classList.add("popupOpcionHab");
                volverSolo.textContent = "Volver";
                volverSolo.onclick = () => {
                    contExtra.style.display = "none";
                    contExtra.innerHTML = "";
                    if (btnDesequipar) safeShow(btnDesequipar);
                    if (btnTraspasar) safeShow(btnTraspasar);
                    if (btnTirar) safeShow(btnTirar);
                    if (btnCerrar) safeShow(btnCerrar);
                };
                contExtra.appendChild(volverSolo);
                return;
            }

            // Crear opción por cada destino
            otros.forEach(dest => {
                const div = document.createElement("div");
                div.classList.add("popupOpcionHab");
                div.textContent = `Traspasar a ${dest.nombre}`;

                div.onclick = () => {
                    // compactar por seguridad
                    if (typeof compactarInventario === "function") compactarInventario(jugador);
                    if (typeof compactarInventario === "function") compactarInventario(dest);

                    // sacar del slot (si sigue siendo el mismo)
                    if (jugador[slotArray] && jugador[slotArray][0] === itemId) {
                        jugador[slotArray] = [];
                    }

                    // agregar SIEMPRE al último lugar del destino
                    agregarAlUltimoLugar(dest, itemId);

                    cerrarPopupEquipamiento();
                    mostrarEquipamientoDelSeleccionado();
                    const solapa = document.querySelector(".solapa.activa")?.dataset?.tab;
                    if (solapa === "objetos" && typeof actualizarInventarioSegunSeleccion === "function") {
                        actualizarInventarioSegunSeleccion();
                    }
                };

                contExtra.appendChild(div);
            });

            // VOLVER (restaura menú principal; NO muestra Cerrar en esta vista)
            const volver = document.createElement("div");
            volver.classList.add("popupOpcionHab");
            volver.textContent = "Volver";
            volver.onclick = () => {
                contExtra.style.display = "none";
                contExtra.innerHTML = "";
                if (btnDesequipar) safeShow(btnDesequipar);
                if (btnTraspasar) safeShow(btnTraspasar);
                if (btnTirar) safeShow(btnTirar);
                if (btnCerrar) safeShow(btnCerrar);
            };
            contExtra.appendChild(volver);
        };
    }

    // TIRAR -> simplemente eliminar del slot
    if (btnTirar) {
        btnTirar.onclick = () => {
            if (jugador[slotArray] && jugador[slotArray][0] === itemId) {
                jugador[slotArray] = [];
            }
            cerrarPopupEquipamiento();
            mostrarEquipamientoDelSeleccionado();
            const solapa = document.querySelector(".solapa.activa")?.dataset?.tab;
            if (solapa === "objetos" && typeof actualizarInventarioSegunSeleccion === "function") {
                actualizarInventarioSegunSeleccion();
            }
        };
    }

    // CERRAR (visible en la vista principal del popup)
    if (btnCerrar) btnCerrar.onclick = () => cerrarPopupEquipamiento();

    // click fuera para cerrar
    fondo.onclick = e => { if (e.target === fondo) cerrarPopupEquipamiento(); };

    // Mostrar popup (se espera que el CSS lo centre)
    fondo.style.display = "flex";
}

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
// INICIALIZADOR DEL POPUP DE EQUIPAMIENTO
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
// SELECCIÓN DE JUGADOR
// =====================================================

function seleccionarTarjeta(jugador, tarjeta) {
    document.querySelectorAll(".cartaJugador")
        .forEach(t => t.classList.remove("seleccionada"));

    tarjeta.classList.add("seleccionada");

    const solapaActiva = document.querySelector(".solapa.activa").dataset.tab;

    if (solapaActiva === "caract") {
        mostrarEstadisticasDelSeleccionado();
        mostrarEquipamientoDelSeleccionado();
    } 
    else if (solapaActiva === "objetos") {
        actualizarInventarioSegunSeleccion();
    } 
    else {
        actualizarHechizosSegunSeleccion();
    }
}

// =====================================================
// ESTADÍSTICAS
// =====================================================

function mostrarEstadisticasDelSeleccionado() {
    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugador = jugadores[tarjeta.dataset.jugadorIndex];
    const info = document.getElementById("infoEstadisticas");

    info.innerHTML = `
        <table class="tablaStats">
            <tr><td class="statNombre">Sexo</td><td class="statValor">${jugador.sexo}</td></tr>
            <tr><td class="statNombre">Ataque</td><td class="statValor">${jugador.fuerza}</td></tr>
            <tr><td class="statNombre">Defensa</td><td class="statValor">${jugador.defensa}</td></tr>
            <tr><td class="statNombre">Poder Mágico</td><td class="statValor">${jugador.poderMagico}</td></tr>
            <tr><td class="statNombre">Defensa Mágica</td><td class="statValor">${jugador.defensaMagica}</td></tr>
            <tr><td class="statNombre">Velocidad</td><td class="statValor">${jugador.velocidad}</td></tr>
            <tr><td class="statNombre">Experiencia</td><td class="statValor">${jugador.experiencia}</td></tr>
        </table>
    `;
}

// =====================================================
// INVENTARIO
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

                // Efecto brillo suave al pasar el mouse
                cajita.style.transition = "filter 0.2s"; // suaviza el cambio

                cajita.addEventListener("mouseenter", () => {
                    cajita.style.filter = "brightness(1.3)"; // más claro
                });
                cajita.addEventListener("mouseleave", () => {
                    cajita.style.filter = "brightness(1)"; // normal
                });

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
// POPUP DEL INVENTARIO (REEMPLAZAR COMPLETO)
// ------------------------------------------------------
function abrirPopupItem(jugador, item, indexInventario) {

    const popFondo = document.getElementById("popupFondo");
    const btnEquipar = document.getElementById("popupEquipar");
    const btnTraspasar = document.getElementById("popupTraspasar");
    const btnTirar = document.getElementById("popupTirar");
    const btnCerrar = document.getElementById("popupCerrar");
    const listaExtra = document.getElementById("popupOpcionesExtra");

    // RESET — evita duplicación de eventos
    if (btnEquipar) btnEquipar.onclick = null;
    if (btnTraspasar) btnTraspasar.onclick = null;
    if (btnTirar) btnTirar.onclick = null;
    if (btnCerrar) btnCerrar.onclick = null;
    if (popFondo) popFondo.onclick = null;

    // Restaurar menú principal al abrir
    if (btnEquipar) btnEquipar.style.display = "block";
    if (btnTraspasar) btnTraspasar.style.display = "block";
    if (btnTirar) btnTirar.style.display = "block";
    if (btnCerrar) btnCerrar.style.display = "block";
    if (listaExtra) { listaExtra.style.display = "none"; listaExtra.innerHTML = ""; }

    window.itemSeleccionadoIndex = indexInventario;

    function aplicarSolapaVisual(solapa) {
        document.querySelectorAll(".solapa").forEach(b => b.classList.remove("activa"));

        const tabCaract = document.getElementById("tabCaract");
        const tabObjetos = document.getElementById("tabObjetos");
        const tabHechizos = document.getElementById("tabHechizos");

        if (tabCaract) tabCaract.style.display = "none";
        if (tabObjetos) tabObjetos.style.display = "none";
        if (tabHechizos) tabHechizos.style.display = "none";

        const dCaract = document.getElementById("divDerechoCaract");
        const dObjetos = document.getElementById("divDerechoObjetos");
        const dHech = document.getElementById("divDerechoHechizos");

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
        } else { // caract por defecto
            const btn = document.querySelector('.solapa[data-tab="caract"]');
            if (btn) btn.classList.add("activa");
            if (tabCaract) tabCaract.style.display = "flex";
            if (dCaract) dCaract.style.display = "flex";
        }
    }

    // ------------------------------------------------------
    //   Cuando uso ITEMS DE CURACIÓN
    // ------------------------------------------------------
    if (item && item.tipo === "ItemBatalla" && item.efecto?.tipo === "CurarPV") {

        btnEquipar.textContent = "Usar";
        btnEquipar.classList.remove("popupBloqueado");

        btnEquipar.onclick = () => {

            if (btnEquipar) btnEquipar.style.display = "none";
            if (btnTraspasar) btnTraspasar.style.display = "none";
            if (btnTirar) btnTirar.style.display = "none";
            if (btnCerrar) btnCerrar.style.display = "none";

            if (listaExtra) { listaExtra.style.display = "block"; listaExtra.innerHTML = ""; }

            const jugadoresActivos = jugadores.filter(j => j.activo);

            jugadoresActivos.forEach(targetJugador => {
                const div = document.createElement("div");
                div.classList.add("popupOpcion");
                div.textContent = `Usar sobre ${targetJugador.nombre}`;

                div.onclick = () => {
                    const ownerIndex = jugadores.indexOf(jugador);
                    const solapaActiva = document.querySelector(".solapa.activa")?.dataset?.tab || "caract";

                    targetJugador.pv = Math.min(targetJugador.pvMax, targetJugador.pv + item.efecto.cantidad);

                    jugador.inventario[indexInventario] = undefined;
                    compactarInventario(jugador);

                    cerrarPopup();

                    // --- ACTUALIZAR INTERFAZ SIN RECONSTRUIR TODO ---
                    // Actualizar barras/valores visibles si la tarjeta del target está en pantalla
                    const tarjetaTarget = document.querySelector(`.cartaJugador[data-jugador-index="${jugadores.indexOf(targetJugador)}"]`);
                    if (tarjetaTarget) {
                        // Actualizar texto y barra PV dentro de esa tarjeta
                        const labelPV = tarjetaTarget.querySelector(".labelStatus");
                        if (labelPV && targetJugador) {
                            labelPV.textContent = `PV ${targetJugador.pv}/${targetJugador.pvMax}`;
                        }
                        const barraVida = tarjetaTarget.querySelector(".barraVida");
                        if (barraVida && targetJugador) {
                            barraVida.style.width = `${(targetJugador.pv / targetJugador.pvMax) * 100}%`;
                        }
                    }

                    document.querySelectorAll(".cartaJugador").forEach(c => c.classList.remove("seleccionada"));
                    const tarjetaOwner = document.querySelector(`.cartaJugador[data-jugador-index="${ownerIndex}"]`);
                    if (tarjetaOwner) tarjetaOwner.classList.add("seleccionada");

                    // Restaurar visual de la solapa que estaba activa y refrescar sólo su contenido
                    aplicarSolapaVisual(solapaActiva);

                    if (solapaActiva === "objetos") {
                        // refrescar inventario del jugador que quedó seleccionado (owner)
                        actualizarInventarioSegunSeleccion();
                    } else if (solapaActiva === "hechizos") {
                        if (typeof actualizarHechizosSegunSeleccion === "function") actualizarHechizosSegunSeleccion();
                    } else {
                        // caract
                        mostrarEstadisticasDelSeleccionado();
                        mostrarEquipamientoDelSeleccionado();
                    }
                };

                listaExtra.appendChild(div);
            });

            // Opcion VOLVER
            const volver = document.createElement("div");
            volver.classList.add("popupOpcion");
            volver.textContent = "Volver";
            volver.onclick = () => {
                if (listaExtra) { listaExtra.style.display = "none"; listaExtra.innerHTML = ""; }
                if (btnEquipar) btnEquipar.style.display = "block";
                if (btnTraspasar) btnTraspasar.style.display = "block";
                if (btnTirar) btnTirar.style.display = "block";
                if (btnCerrar) btnCerrar.style.display = "block";
            };
            listaExtra.appendChild(volver);
        };

        // TRASPASAR ITEM
        btnTraspasar.onclick = () => {
            if (btnEquipar) btnEquipar.style.display = "none";
            if (btnTraspasar) btnTraspasar.style.display = "none";
            if (btnTirar) btnTirar.style.display = "none";
            if (btnCerrar) btnCerrar.style.display = "none";

            if (listaExtra) { listaExtra.style.display = "block"; listaExtra.innerHTML = ""; }

            const otrosJugadores = jugadores.filter(j => j !== jugador && j.activo);
            if (otrosJugadores.length === 0) {
                const aviso = document.createElement("div");
                aviso.classList.add("popupOpcion");
                aviso.textContent = "No hay compañeros activos.";
                listaExtra.appendChild(aviso);
            } else {
                otrosJugadores.forEach(j => {
                    const div = document.createElement("div");
                    div.classList.add("popupOpcion");
                    div.textContent = `Traspasar a ${j.nombre}`;
                    div.onclick = () => {
                        traspasarItem(jugador, j, item);
                        cerrarPopup();
                    };
                    listaExtra.appendChild(div);
                });
            }

            const volver = document.createElement("div");
            volver.classList.add("popupOpcion");
            volver.textContent = "Volver";
            volver.onclick = () => {
                if (listaExtra) { listaExtra.style.display = "none"; listaExtra.innerHTML = ""; }
                if (btnEquipar) btnEquipar.style.display = "block";
                if (btnTraspasar) btnTraspasar.style.display = "block";
                if (btnTirar) btnTirar.style.display = "block";
                if (btnCerrar) btnCerrar.style.display = "block";
            };
            listaExtra.appendChild(volver);
        };

        // TIRAR
        btnTirar.onclick = () => {
            jugador.inventario[indexInventario] = undefined;
            compactarInventario(jugador);
            cerrarPopup();

            // Mantener selección actual y mostrar inventario
            const tarjetaActual = document.querySelector(".cartaJugador.seleccionada");
            if (tarjetaActual) {
                tarjetaActual.classList.add("seleccionada");
            }
            // Forzar mostrar objetos (si querés mantenerla)
            document.querySelectorAll(".solapa").forEach(b => b.classList.remove("activa"));
            document.querySelector('.solapa[data-tab="objetos"]').classList.add("activa");
            document.getElementById("tabObjetos").style.display = "flex";
            document.getElementById("tabCaract").style.display = "none";
            actualizarInventarioSegunSeleccion();
        };

        // Cerrar
        btnCerrar.onclick = cerrarPopup;

        popFondo.style.display = "flex";
        return;
    }

    // ------------------------------------------------------
    //   EQUIPAR (solo equipamiento)
    // ------------------------------------------------------
    const itemSexo = (item.sexo || "").toLowerCase();
    const jugadorSexo = (jugador.sexo || "").toLowerCase();
    const itemClase = (item.clase || "").toLowerCase();
    const jugadorClaseBase = (jugador.claseBase || "").toLowerCase();

    function sexoCompatible() {
        if (item.sexo === "Todos") return true;
        if (item.sexo === "Ambos") return true;
        return itemSexo === jugadorSexo;
    }
    function claseCompatible() {
        if (item.clase === "Todos") return true;
        if (item.clase === "Ambos") return true;
        return itemClase === jugadorClaseBase;
    }

    let puedeEquipar = true;
    if (item.tipo !== "Equipamiento") puedeEquipar = false;
    if (puedeEquipar && !sexoCompatible()) puedeEquipar = false;
    if (puedeEquipar && !claseCompatible()) puedeEquipar = false;

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

    const otrosJugadores = jugadores.filter(j => j !== jugador && j.activo);
    if (otrosJugadores.length === 0) {
        btnTraspasar.style.display = "none";
    } else {
        btnTraspasar.style.display = "block";
    }

    btnTraspasar.onclick = () => {
        if (btnEquipar) btnEquipar.style.display = "none";
        if (btnTraspasar) btnTraspasar.style.display = "none";
        if (btnTirar) btnTirar.style.display = "none";
        if (btnCerrar) btnCerrar.style.display = "none";

        if (listaExtra) { listaExtra.style.display = "block"; listaExtra.innerHTML = ""; }
        otrosJugadores.forEach(j => {
            const div = document.createElement("div");
            div.classList.add("popupOpcion");
            div.textContent = `Traspasar a ${j.nombre}`;
            div.onclick = () => {
                traspasarItem(jugador, j, item);
                cerrarPopup();
            };
            listaExtra.appendChild(div);
        });
        const volver = document.createElement("div");
        volver.classList.add("popupOpcion");
        volver.textContent = "Volver";
        volver.onclick = () => {
            if (listaExtra) { listaExtra.style.display = "none"; listaExtra.innerHTML = ""; }
            if (btnEquipar) btnEquipar.style.display = "block";
            if (btnTraspasar) btnTraspasar.style.display = "block";
            if (btnTirar) btnTirar.style.display = "block";
            if (btnCerrar) btnCerrar.style.display = "block";
        };
        listaExtra.appendChild(volver);
    };

    btnTirar.onclick = () => {
        jugador.inventario[indexInventario] = undefined;
        compactarInventario(jugador);
        cerrarPopup();
        actualizarInventarioSegunSeleccion();
    };

    btnCerrar.onclick = cerrarPopup;
    if (popFondo) popFondo.onclick = e => { if (e.target === popFondo) cerrarPopup(); };
    if (popFondo) popFondo.style.display = "flex";
}

// ------------------------------------------------------
// TRASPASAR ITEM
// ------------------------------------------------------
function traspasarItem(origen, destino, item) {

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
// CERRAR POPUP
// ------------------------------------------------------
function cerrarPopup() {
    document.getElementById("popupFondo").style.display = "none";
    document.getElementById("popupOpcionesExtra").style.display = "none";
}

// ------------------------------------------------------
// EQUIPAR
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







// =====================================================
// HECHIZOS
// =====================================================

function actualizarHechizosSegunSeleccion() {

    const tarjeta = document.querySelector(".cartaJugador.seleccionada");
    if (!tarjeta) return;

    const jugador = jugadores[tarjeta.dataset.jugadorIndex];

    // Contenedores por jugador
    const cont1 = document.getElementById("hechizosJugador1");
    const cont2 = document.getElementById("hechizosJugador2");
    const cont3 = document.getElementById("hechizosJugador3");

    // Limpieza total para evitar superposiciones
    cont1.innerHTML = "";
    cont2.innerHTML = "";
    cont3.innerHTML = "";

    // El contenedor donde se dibujarán los hechizos
    const contenedor = document.getElementById(
        `hechizosJugador${Number(tarjeta.dataset.jugadorIndex) + 1}`
    );

    // Si no tiene ataques aprendidos
    if (!jugador.ataques || jugador.ataques.length === 0) {
        contenedor.innerHTML = `<p>${jugador.nombre} no conoce ningún ataque.</p>`;
        return;
    }

    // Crear tabla contenedora (4 columnas)
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
            <td class="colHechizo" id="colFisico"></td>
            <td class="colHechizo" id="colMagico"></td>
            <td class="colHechizo" id="colCuracion"></td>
            <td class="colHechizo" id="colConjuro"></td>
        </tr>
    `;

    contenedor.appendChild(tabla);

    // Columnas individuales
    const colFisico = tabla.querySelector("#colFisico");
    const colMagico = tabla.querySelector("#colMagico");
    const colCuracion = tabla.querySelector("#colCuracion");
    const colConjuro = tabla.querySelector("#colConjuro");

    // Clasificación de ataques
    jugador.ataques.forEach(ataque => {

        const item = document.createElement("div");
        item.textContent = ataque.nombre;
        item.style.margin = "4px 0";

        // Estilo para ataques de curación
        if (ataque.tipo.toLowerCase() === "curacion") {
            item.style.color = "blue";
            item.style.cursor = "pointer";
            item.style.textDecoration = "underline";
        }

        // Colocar según tipo
        switch (ataque.tipo.toLowerCase()) {
            case "fisico":
                colFisico.appendChild(item);
                break;
            case "magia":
            case "mágico":
            case "magico":
                colMagico.appendChild(item);
                break;
            case "curacion":
                colCuracion.appendChild(item);
                break;
            case "conjuro":
                colConjuro.appendChild(item);
                break;
        }
    });
}











// =====================================================
// BOTON PARA SALIR
// =====================================================

btnPaginaStatus.addEventListener("click", () => {
    paginaPrincipal.style.display = "none";
    paginaStatus.style.display = "block";

    actualizarPaginaStatus();
});

//---------------------------------------------------------------------------------------------------------------------------------------

// ================================================
// POSICIONES DE FORMACION (PERSISTENTES)
// ================================================
let posicionesFormacion = {
    1: { fila: 2, col: 3 },  // Héroe
    2: { fila: 1, col: 1 },  // Benja
    3: { fila: 3, col: 1 }   // Jaz
};

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

    td.innerHTML = "";

    const jugador = jugadores.find(j => j.id === idJugador);

    const img = document.createElement("img");
    img.src = jugador.img.replace(".png", "Icono.png");
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
        if (td.firstChild && td.firstChild.dataset && td.firstChild.dataset.jugadorId == idJugador) {
            td.innerHTML = "";
        }
    });
}

// ==========================================================
// PISO DEL DUNGEON
// ==========================================================

let piso = 1;

function actualizarPiso() {
    document.getElementById("pisoTexto").textContent = "Piso " + piso;
    document.getElementById("pisoActual").textContent = "Piso " + piso;
}

// ==========================================================
// TABLERO DE BATALLA
// ==========================================================

function crearTablero() {
    const filas = 3;
    const columnas = 7;
    const tableroDiv = document.getElementById("tablero");

    tableroDiv.innerHTML = "";
    tableroDiv.className = "tableroGuerra"; 

    // Crear celdas
    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            const celda = document.createElement("div");
            celda.classList.add("celdaGuerra");
            celda.dataset.fila = fila;
            celda.dataset.columna = col;

            tableroDiv.appendChild(celda);
        }
    }
}

// ==========================================================
// COLOCAR JUGADORES EN TABLERO
// ==========================================================

function colocarJugadoresEnTablero() {

    jugadores.forEach(j => {
        if (!j.activo) return;

        const pos = posicionesFormacion[j.id];
        if (!pos) return;

        const filaTab = pos.fila - 1;
        const colTab = pos.col - 1;

        // OJO: ahora buscamos celdaGuerra
        const celda = document.querySelector(
            `.celdaGuerra[data-fila="${filaTab}"][data-columna="${colTab}"]`
        );

        if (!celda) return;

        const img = document.createElement("img");
        img.src = j.img;
        img.className = "imgPersonaje";

        // Asignar z-index según la fila (más abajo = más arriba visualmente)
        img.style.zIndex = 10 + filaTab; 
        img.style.position = "relative";

        celda.innerHTML = "";
        celda.appendChild(img);
    });
}

// ==========================================================
// INICIAR TABLERO DE GUERRA
// ==========================================================

function iniciarTablero() {
    actualizarPiso();
    crearTablero();
    colocarJugadoresEnTablero(); // ← SIEMPRE LEE posicionesFormacion EN TIEMPO REAL
}
