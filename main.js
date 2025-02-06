import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx/xlsx.mjs";

const form = document.getElementById("registro-form");
const descargarBtn = document.getElementById("descargar");
const borrarBtn = document.getElementById("borrar");
let registros = []; // Array para almacenar los datos del formulario

// Recupera los registros guardados en LocalStorage al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const registrosGuardados = JSON.parse(localStorage.getItem("registros")) || [];
  registros = registrosGuardados; // Cargar los registros desde LocalStorage
});

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
  };
  registros.push(data); // Añadir datos al array
  // Guardar los registros actualizados en LocalStorage
  localStorage.setItem("registros", JSON.stringify(registros));
  form.reset();
  Swal.fire("¡Genial!", "El registro se guardó correctamente.", "success");
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

// Evento para borrar los datos almacenados en el array y LocalStorage (reset)
borrarBtn.addEventListener("click", () => {
  registros = [];  // Vaciar el array en memoria
  localStorage.removeItem("registros"); // Eliminar registros del LocalStorage
  Swal.fire("¡Listo!", "Los datos han sido borrados.", "success");
});