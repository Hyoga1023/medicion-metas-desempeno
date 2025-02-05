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
    observacion: form.observacion.value,
    horaCreacion: new Date().toISOString()  // Agregar la hora de creación del registro
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

  // Crear una copia de los registros y asegurarse de que la hora de creación esté en el formato correcto
  const registrosConHora = registros.map((registro) => {
    return {
      ...registro,
      horaCreacion: new Date(registro.horaCreacion).toLocaleString()  // Asegura que la hora esté en formato correcto
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(registrosConHora); // Crear hoja de cálculo con los datos actualizados
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

  // Descargar archivo Excel
  XLSX.writeFile(workbook, "registros_inhouse.xlsx");
  Swal.fire("¡Listo!", "El archivo Excel se descargó correctamente.", "success");
});
// Evento para borrar los datos almacenados en IndexedDB (reset)
borrarBtn.addEventListener("click", () => {
  Swal.fire({
    title: "¡Advertencia!",
    text: "Estás a punto de borrar todos los registros y el mundo como lo conoces podria desaparecer!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    background: "var(--color-negro)",
    color: "var(--color-blanco)",
    confirmButtonColor: "var(--color-terciario)",
    cancelButtonColor: "var(--color-cuaternario)"
  }).then((result) => {
    if (result.isConfirmed) {
      const db = request.result;
      const transaction = db.transaction(["registros"], "readwrite");
      const store = transaction.objectStore("registros");

      const clearRequest = store.clear(); // Borrar todos los registros de la base de datos

      clearRequest.onsuccess = function () {
        registros = []; // Vaciar el array en memoria
        Swal.fire({
          title: "¡Listo!",
          text: "Los datos han sido borrados.",
          icon: "success",
          background: "var(--color-negro)",
          color: "var(--color-blanco)",
          confirmButtonColor: "var(--color-terciario)"
        });
      };

      clearRequest.onerror = function () {
        console.log("Error al borrar los registros");
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al intentar borrar los registros.",
          icon: "error",
          background: "var(--color-negro)",
          color: "var(--color-blanco)",
          confirmButtonColor: "var(--color-cuaternario)"
        });
      };
    }
  });
});
