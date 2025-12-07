/* ============================================
   VARIABLES GLOBALES
============================================ */
let sexoSeleccionado = null;
let claseSeleccionada = null;

const datosJugador = {}; // Objeto base para enviar al tablero

// Conversión de nombre mostrado → nombre interno para el juego
const nombresInternos = {
    "Javier": "javi",
    "Jazmín": "jaz",
    "Benjamín": "benja",
    "Sebastian": "sebas"
};

/* ============================================
   SELECCION PERSONAJE YA CREADO
============================================ */
// Lista de personajes disponibles
const personajesDisponibles = [
    { nombre: "Javier", icono: "javiIcono.png" },
    { nombre: "Jazmín", icono: "jazIcono.png" },
    { nombre: "Benjamín", icono: "benjaIcono.png" },
    { nombre: "Sebastian", icono: "sebasIcono.png" }
];

// Referencias a elementos
const botonAbrir = document.getElementById("seleccionarPj");
const popup = document.getElementById("popupElegirPj");
const botonCerrar = document.getElementById("cerrarPopupElegirPj");
const contenedorPersonajes = document.getElementById("mostradoPersonajes");

let personajeSeleccionado = null;

// ===== ABRIR POPUP =====
botonAbrir.addEventListener("click", () => {

    // Si está en modo cambiar, NO abrir popup → habilitar escritura
    if (botonAbrir.classList.contains("modoCambiar")) {
        const inputNombre = document.getElementById("nombrePJ");

        // Habilitar edición y limpiar selección
        inputNombre.disabled = false;

        // 👇 LIMPIAR INPUT y restaurar placeholder
        inputNombre.value = "";
        inputNombre.placeholder = "Escriba aqui...";

        botonAbrir.textContent = "Pj Creados";
        botonAbrir.classList.remove("modoCambiar");

        personajeSeleccionado = null;

        // Quitar brillo a las cards
        document.querySelectorAll(".personajeCard")
            .forEach(c => c.classList.remove("seleccionado"));

        return; // NO abre el popup
    }

    // Si NO está en modo cambiar → abrir popup normal
    popup.style.display = "flex";
    mostrarPersonajes();
});


// ===== CERRAR POPUP =====
botonCerrar.addEventListener("click", () => {
    popup.style.display = "none";

    // Si hay personaje seleccionado → completar input y bloquearlo
    if (personajeSeleccionado !== null) {
        const pj = personajesDisponibles[personajeSeleccionado];

        const inputNombre = document.getElementById("nombrePJ");
        const btnSeleccion = document.getElementById("seleccionarPj");

        // Mostrar nombre visible (Javier, Jazmín, etc.)
        inputNombre.value = pj.nombre;
        inputNombre.disabled = true;

        btnSeleccion.textContent = "Cambiar nombre";
        btnSeleccion.classList.add("modoCambiar");
    }
});


// ===== MOSTRAR PERSONAJES EN EL POPUP =====
function mostrarPersonajes() {
    contenedorPersonajes.innerHTML = ""; // limpiamos antes

    personajesDisponibles.forEach((pj, index) => {
        const div = document.createElement("div");
        div.classList.add("personajeCard");
        div.dataset.index = index;

        div.innerHTML = `
            <img src="imgs/iconos/${pj.icono}" class="imgPersonaje">
            <p>${pj.nombre}</p>
        `;

        // Evento de selección
        div.addEventListener("click", () => seleccionarPersonaje(index));

        contenedorPersonajes.appendChild(div);
    });
}

// ===== SELECCIONAR / DESELECCIONAR PERSONAJE =====
function seleccionarPersonaje(i) {
    const cartas = document.querySelectorAll(".personajeCard");

    if (personajeSeleccionado === i) {
        // si clickea el mismo → deselecciona
        cartas[i].classList.remove("seleccionado");
        personajeSeleccionado = null;
        return;
    }

    // Quitar selección previa
    cartas.forEach(c => c.classList.remove("seleccionado"));

    // Seleccionar nuevo
    cartas[i].classList.add("seleccionado");
    personajeSeleccionado = i;
}

// ===== DESELECCIONAR SI SE CLICKEA FUERA DE LAS CARDS =====
popup.addEventListener("click", (e) => {
    // Si NO hay personaje seleccionado, no hacer nada
    if (personajeSeleccionado === null) return;

    // Si clickeó una card, no deseleccionamos
    if (e.target.closest(".personajeCard")) return;

    // Si clickeó el botón cerrar, tampoco deseleccionar aquí
    if (e.target.id === "cerrarPopupElegirPj") return;

    // Cualquier otro clic dentro del popup → deseleccionar
    const cartas = document.querySelectorAll(".personajeCard");

    cartas.forEach(c => c.classList.remove("seleccionado"));
    personajeSeleccionado = null;
});


/* ============================================
   SELECCIÓN SEXO
============================================ */
document.querySelectorAll("#opcionesSexo button").forEach(b => {
    b.addEventListener("click", () => {
        document.querySelectorAll("#opcionesSexo button")
            .forEach(x => x.classList.remove("seleccionado"));
        b.classList.add("seleccionado");

        // Guardar SIEMPRE en minúsculas
        sexoSeleccionado = b.dataset.sexo.toLowerCase();
    });
});

/* ============================================
   SELECCIÓN DE CLASE
============================================ */
document.querySelectorAll(".cartaClase").forEach(carta => {
    carta.addEventListener("click", () => {
        document.querySelectorAll(".cartaClase")
            .forEach(c => c.classList.remove("seleccionado"));
        carta.classList.add("seleccionado");

        // Guardado siempre en masculino + minúsculas
        claseSeleccionada = carta.dataset.clase.toLowerCase();
        datosJugador.clase = claseSeleccionada;
    });
});

/* ============================================
   VALORES BASE SEGÚN CLASE
============================================ */
const valoresBase = {
    guerrero: { pvMax: 25, pmMax: 10, fuerza: 3, defensa: 2, poderMagico: 0, defensaMagica: 1, velocidad: 2 },
    paladin:  { pvMax: 28, pmMax: 12, fuerza: 2, defensa: 3, poderMagico: 1, defensaMagica: 2, velocidad: 1 },
    clerigo:  { pvMax: 20, pmMax: 15, fuerza: 2, defensa: 1, poderMagico: 2, defensaMagica: 1, velocidad: 2 },
    hechicero:{ pvMax: 15, pmMax: 20, fuerza: 1, defensa: 0, poderMagico: 3, defensaMagica: 1, velocidad: 1 }
};

/* ============================================
   CAPITALIZE
============================================ */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ============================================
   POPUP - Se crea solo una vez
============================================ */

// Elementos del popup
const popupFondo = document.getElementById("popupFondoCreacion");
const popupVentana = document.getElementById("popupVentanaCreacion");
const infoDiv = document.getElementById("infoCreacion");

// Botones popup
const btnConfirmar = document.createElement("button");
const btnCancelar = document.createElement("button");

btnConfirmar.textContent = "Confirmar";
btnCancelar.textContent = "Cancelar";

btnConfirmar.classList.add("btnPopupConfirmar");
btnCancelar.classList.add("btnPopupCancelar");

// Insertarlos
infoDiv.insertAdjacentElement("afterend", btnCancelar);
btnCancelar.insertAdjacentElement("afterend", btnConfirmar);

/* Cerrar popup clic afuera */
popupFondo.addEventListener("click", (e) => {
    if (e.target === popupFondo) {
        popupFondo.style.display = "none";
    }
});

/* CANCELAR */
btnCancelar.addEventListener("click", () => {
    popupFondo.style.display = "none";
});

/* ============================================
   CONFIRMAR → CREAR PERSONAJE
============================================ */
btnConfirmar.addEventListener("click", () => {

    const nombre = document.getElementById("nombrePJ").value.trim();
    const base = valoresBase[datosJugador.clase];

    /* Convertir nombre visible → interno (javi, jaz, benja, sebas) */
    const nombreInternoGuardar = nombresInternos[nombre] || nombre.toLowerCase();

    /* Clases femeninas para mostrar */
    const clasesFlexibles = {
        guerrero: "Guerrera",
        hechicero: "Hechicera",
        paladin: "Paladina",
        clerigo: "Clériga"
    };

    // SOLO PARA MOSTRAR (no se guarda)
    let claseMostrar = datosJugador.clase;

    if (sexoSeleccionado === "femenino" && clasesFlexibles[datosJugador.clase]) {
        claseMostrar = clasesFlexibles[datosJugador.clase];
    }

    /* Arma inicial según clase */
    let armaInicial = [];

    if (datosJugador.clase === "guerrero" || datosJugador.clase === "paladin") {
        armaInicial = [2];
    } else {
        armaInicial = [3]; // hechicero / clerigo
    }

    /* Ataque inicial según clase */
    let ataquesIniciales = [];

    if (datosJugador.clase === "guerrero" || datosJugador.clase === "paladin") {
        ataquesIniciales = [1];   // ID 1 → ataque físico básico
    } else {
        ataquesIniciales = [9];   // ID 9 → ataque mágico/clérigo
    }

    /* Objeto final ORDENADO */
    const nuevoPJ = {
        sexo: sexoSeleccionado,
        id: 1,
        nombre: nombreInternoGuardar,     // 👈 SE GUARDA EL NOMBRE INTERNO
        tipo: "jugador",
        clase: datosJugador.clase,        // siempre en masculino y minúsculas
        nivel: 1,

        pv: base.pvMax,
        pvMax: base.pvMax,
        pm: base.pmMax,
        pmMax: base.pmMax,

        fuerza: base.fuerza,
        poderMagico: base.poderMagico,
        defensa: base.defensa,
        defensaMagica: base.defensaMagica,
        velocidad: base.velocidad,

        experiencia: 0,
        puntosDisponibles: 0,

        // Imagen basada en el nombre interno
        img: "imgs/" + nombreInternoGuardar + ".png",

        ataquesAprendidosNum: ataquesIniciales,
        inventario: [],

        armaEquipadx: armaInicial,
        armaduraEquipadx: [],
        escudoEquipadx: [],
        cascoEquipadx: [],
        accesorioEquipadx: [],

        estado: 1
    };

    // Guardar
    localStorage.setItem("jugadorCreado", JSON.stringify(nuevoPJ));

    console.log("Personaje creado y guardado:");
    console.log(nuevoPJ);

    window.location.href = "tablero.html";
});


/* ============================================
   BOTÓN CREAR → abre popup
============================================ */
document.getElementById("btnCrear").addEventListener("click", () => {

    const nombre = document.getElementById("nombrePJ").value.trim();

    if (!nombre) { alert("Pon un nombre!"); return; }
    if (!sexoSeleccionado) { alert("Selecciona un sexo."); return; }
    if (!claseSeleccionada) { alert("Selecciona una clase."); return; }

    const clasesFlexibles = {
        guerrero: "Guerrera",
        hechicero: "Hechicera",
        paladin: "Paladina",
        clerigo: "Clériga"
    };

    let claseMostrar = datosJugador.clase;

    if (sexoSeleccionado === "femenino" && clasesFlexibles[datosJugador.clase]) {
        claseMostrar = clasesFlexibles[datosJugador.clase];
    }

    infoDiv.textContent = `¿Querés crear a ${nombre} (Clase: ${capitalize(claseMostrar)})?`;

    popupFondo.style.display = "flex";
});





















/* ============================================
   CREAR PERSONAJE
============================================ */
/* document.getElementById("btnCrear").addEventListener("click", () => {

    const nombre = document.getElementById("nombrePJ").value.trim();

    if (!nombre) { alert("Pon un nombre!"); return; }
    if (!sexoSeleccionado) { alert("Selecciona un sexo."); return; }
    if (!claseSeleccionada) { alert("Selecciona una clase."); return; }

    const base = valoresBase[datosJugador.clase];

    // Versión femenina para mostrar si corresponde
    const clasesFlexibles = {
        guerrero: "Guerrera",
        hechicero: "Hechicera",
        paladin: "Paladina",
        clerigo: "Cleriga"
    };

    let claseMostrar = datosJugador.clase; // masculino por defecto
    if (sexoSeleccionado.toLowerCase() === "femenino" && clasesFlexibles[datosJugador.clase]) {
        claseMostrar = clasesFlexibles[datosJugador.clase];
    }

    const nuevoPJ = {
        sexo: sexoSeleccionado,
        id: 1,
        nombre: nombre,
        tipo: "jugador",

        claseBase: datosJugador.clase, // minúscula, masculino
        claseMostrar: claseMostrar,    // para mostrar
        nivel: 1,

        pv: base.pvMax,
        pvMax: base.pvMax,
        pm: base.pmMax,
        pmMax: base.pmMax,

        fuerza: base.fuerza,
        defensa: base.defensa,
        poderMagico: base.poderMagico,
        defensaMagica: base.defensaMagica,
        velocidad: base.velocidad,

        experiencia: 0,
        puntosDisponibles: 0,

        inventario: [],
        ataquesAprendidosNum: [],

        armaEquipadx: [],
        armaduraEquipadx: [],
        escudoEquipadx: [],
        cascoEquipadx: [],
        accesorioEquipadx: [],

        estado: 1,
        activo: true,

        img: "imgs/" + nombre.toLowerCase() + ".png"
    };

    localStorage.setItem("jugadorCreado", JSON.stringify(nuevoPJ));
    alert("¡Personaje creado!");
    window.location.href = "tablero.html";
}); */

