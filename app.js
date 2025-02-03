document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const usuario_inhouse = document.getElementById('usuario').value.trim();
        const tipo_id = document.getElementById('tipo-id').value.trim();
        const numero_id = document.getElementById('numero-id').value.trim();
        const nombre_afiliado = document.getElementById('nombre').value.trim();
        const fecha = document.getElementById('fecha').value;
        const observacion = document.getElementById('observacion').value.trim();

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

        // Validar que la fecha no sea futura
        const fechaInput = new Date(fecha);
        const fechaActual = new Date();

        if (fechaInput > fechaActual) {
            Swal.fire("Advertencia", "La fecha no puede ser futura.", "warning");
            return;
        }

        // Preparar los datos para enviar
        const data = {
            usuario_inhouse,
            tipo_id,
            numero_id,
            nombre_afiliado,
            fecha,
            observacion
        };

        try {
            const response = await fetch('/guardar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                Swal.fire('Éxito', 'Datos guardados correctamente', 'success');
                form.reset();
            } else {
                Swal.fire('Error', 'No se pudieron guardar los datos', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'Problema de conexión', 'error');
        }
    });
});