import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx/xlsx.mjs";

const form = document.getElementById("registro-form");
const descargarBtn = document.getElementById("descargar");
const borrarBtn = document.getElementById("borrar");
let registros = []; // Array para almacenar los datos del formulario

// Abrir (o crear) la base de datos IndexedDB llamada "miBaseDeDatos"
const request = indexedDB.open("miBaseDeDatos", 1);

request.onerror = function (event) {
  console.log("Error al abrir la base de datos", event);
};

request.onsuccess = function (event) {
  console.log("Base de datos abierta con éxito", event.target.result);
  cargarRegistros();  // Cargar los registros desde IndexedDB cuando la base de datos esté lista
};

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  // Crear un objeto almacén de datos llamado "registros"
  const store = db.createObjectStore("registros", { keyPath: "id", autoIncrement: true });

  // Crear índices en el almacén para hacer consultas rápidas (si los necesitas)
  store.createIndex("nombre", "nombre", { unique: false });
};

// Recupera los registros guardados en IndexedDB al cargar la página
function cargarRegistros() {
  const db = request.result;
  const transaction = db.transaction(["registros"]);
  const store = transaction.objectStore("registros");

  const getAllRequest = store.getAll();  // Obtener todos los registros

  getAllRequest.onsuccess = function (event) {
    registros = event.target.result;  // Guardar los registros en memoria
  };

  getAllRequest.onerror = function (event) {
    console.log("Error al cargar los registros", event);
  };
}

// Evento para enviar los datos del formulario y añadirlos al array
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    usuario: form.usuario.value,
    tipoId: form["tipo-id"].value,
    numeroId: form["numero-id"].value,
    nombre: form.nombre.value,
    fecha: form.fecha.value,
    observacion: form.observacion.value,
    horaCreacion: new Date().toLocaleString()  // Agregar la hora de creación del registro
  };

  // Agregar los datos a la base de datos IndexedDB
  const db = request.result;
  const transaction = db.transaction(["registros"], "readwrite");
  const store = transaction.objectStore("registros");
  const addRequest = store.add(data);

  addRequest.onsuccess = () => {
    registros.push(data);  // Añadir datos al array en memoria
    Swal.fire("¡Genial!", "El registro se guardó correctamente.", "success");
  };

  addRequest.onerror = () => {
    console.log("Error al agregar el registro.");
  };

  form.reset();
});

// Evento para descargar el archivo Excel
descargarBtn.addEventListener("click", () => {
  if (registros.length === 0) {
    Swal.fire("Advertencia", "No hay datos para descargar.", "warning");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(registros); // Crear hoja de cálculo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");
  XLSX.writeFile(workbook, "registros_inhouse.xlsx"); // Descargar archivo
  Swal.fire("¡Listo!", "El archivo Excel se descargó correctamente.", "success");
});

// Evento para borrar los datos almacenados en IndexedDB (reset)
borrarBtn.addEventListener("click", () => {
  const db = request.result;
  const transaction = db.transaction(["registros"], "readwrite");
  const store = transaction.objectStore("registros");

  const clearRequest = store.clear();  // Borrar todos los registros de la base de datos

  clearRequest.onsuccess = function () {
    registros = [];  // Vaciar el array en memoria
    Swal.fire("¡Listo!", "Los datos han sido borrados.", "success");
  };

  clearRequest.onerror = function () {
    console.log("Error al borrar los registros");
  };
});
