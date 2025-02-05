// src/main.js
import app from "./firebaseConfig";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import Swal from "sweetalert2";

const db = getFirestore(app);

const form = document.getElementById("registro-form");

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
    await addDoc(collection(db, "registros"), data);
    Swal.fire("¡Genial!", "El registro se guardó correctamente.", "success");
    form.reset();
  } catch (error) {
    console.error("Error al guardar el registro:", error);
    Swal.fire("Error", "No se pudo guardar el registro.", "error");
  }
});
