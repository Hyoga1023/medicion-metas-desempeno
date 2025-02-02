document.getElementById("registro-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const usuario_inhouse = document.getElementById("Usuario").value.trim();
    const tipo_id = document.getElementById("tipo-id").value.trim();
    const numero_id = document.getElementById("numero-id").value.trim();
    const nombre_afiliado = document.getElementById("nombre").value.trim();
    const fecha = document.getElementById("fecha").value;
    const observacion = document.getElementById("observacion").value.trim();

    // Validación básica
    if (!usuario_inhouse || !tipo_id || !numero_id || !nombre_afiliado || !fecha) {
        Swal.fire("Advertencia", "Por favor completa todos los campos requeridos.", "warning");
        return;
    }

    // Validar que el número de identificación solo contenga números
    if (!/^\d+$/.test(numero_id)) {
        Swal.fire("Advertencia", "El número de identificación debe contener solo números.", "warning");
        return;
    }

    // Preparar los datos para enviar
    const data = {
        usuario_inhouse,
        tipo_id,
        numero_id,
        nombre_afiliado,
        fecha,
        observacion,
    };
    //mysql://root:iydDXXwObaOdjpVYiQhvhIpwBJaouzKF@monorail.proxy.rlwy.net:53930/railway
    // Enviar los datos al servidor
    try {
        const response = await fetch("http://localhost:3000/guardar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            Swal.fire("Éxito", "Datos guardados correctamente", "success");
            document.getElementById("registro-form").reset(); // Limpia el formulario tras éxito
        } else {
            Swal.fire("Error", "No se pudieron guardar los datos. Revisa el servidor.", "error");
        }
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        Swal.fire("Error", "Hubo un problema con la conexión. Intenta de nuevo más tarde.", "error");
    }
});
const fechaInput = new Date(fecha);
const fechaActual = new Date();

if (fechaInput > fechaActual) {
    Swal.fire("Advertencia", "La fecha no puede ser futura.", "warning");
    return;
}
