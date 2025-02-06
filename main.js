import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import app from './firebaseConfig.js';
import * as XLSX from "https://cdn.jsdelivr.net/npm/xlsx/xlsx.mjs";

const db = getFirestore(app);
const form = document.getElementById("registro-form");
const descargarBtn = document.getElementById("descargar");
const borrarBtn = document.getElementById("borrar");

let registros = []; // Array para almacenar los datos del formulario

// Evento para enviar datos a Firebase y añadirlos al array
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    usuario: form.usuario.value,
    tipoId: form["tipo-id"].value,
    numeroId: form["numero-id"].value,
    nombre: form.nombre.value,
    fecha: form.fecha.value,
    observacion: form.observacion.value,
  };

  try {
    // Guardar en Firebase
    await addDoc(collection(db, "registros"), data);
    Swal.fire("¡Genial!", "El registro se guardó correctamente.", "success");
    registros.push(data); // Añadir datos al array
    form.reset();
  } catch (error) {
    console.error("Error al guardar el registro:", error);
    Swal.fire("Error", "No se pudo guardar el registro.", "error");
  }
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

// Evento para borrar el archivo (reset del array)
borrarBtn.addEventListener("click", () => {
  registros = [];
  Swal.fire("¡Listo!", "Los datos han sido borrados.", "success");
});
