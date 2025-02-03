// app.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario_inhouse = document.getElementById('usuario').value.trim();
        const tipo_id = document.getElementById('tipo-id').value.trim();
        const numero_id = document.getElementById('numero-id').value.trim();
        const nombre_afiliado = document.getElementById('nombre').value.trim();
        const fecha = document.getElementById('fecha').value;
        const observacion = document.getElementById('observacion').value.trim();

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

    // Agregar eventos para botones de descargar y borrar
    document.getElementById('descargar').addEventListener('click', async () => {
        try {
            const response = await fetch('/descargar');
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'registros.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                Swal.fire('Error', 'No se pudo descargar el archivo', 'error');
            }
        } catch (error) {
            console.error('Error al descargar:', error);
        }
    });

    document.getElementById('borrar').addEventListener('click', async () => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará todos los registros',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, borrar'
            });

            if (result.isConfirmed) {
                const response = await fetch('/borrar-todo', { method: 'DELETE' });
                if (response.ok) {
                    Swal.fire('Eliminado', 'Todos los registros han sido borrados', 'success');
                } else {
                    Swal.fire('Error', 'No se pudieron borrar los registros', 'error');
                }
            }
        } catch (error) {
            console.error('Error al borrar:', error);
        }
    });
});