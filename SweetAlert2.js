document.getElementById("borrar").addEventListener("click", async () => {
    const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡Si borras el archivo, no podrás recuperarlo y el mundo como lo conoces podría desaparecer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6A1E55",
        cancelButtonColor: "#1A1A1D",
        confirmButtonText: "Sí, borrar",
        cancelButtonText: "Cancelar"
    });

    if (!confirmacion.isConfirmed) {
        Swal.fire("Cancelado", "Nada fue borrado, el mundo sigue intacto... por ahora.", "info");
        return;
    }

    try {
        // Petición DELETE al servidor
        const response = await fetch("http://localhost:3000/borrar-todo", {
            method: "DELETE"
        });

        if (response.ok) {
            Swal.fire(
                "¡Borrado!",
                "El archivo ha sido borrado correctamente. Respira tranquilo.",
                "success"
            ).then(() => {
                console.log("Todos los registros fueron eliminados.");
            });
        } else {
            Swal.fire("Error", "No se pudieron borrar los registros. ¿Tal vez el servidor está de vacaciones?", "error");
        }
    } catch (error) {
        console.error("Error al intentar borrar todos los registros:", error);
        Swal.fire("Error", "Hubo un problema con la conexión. Intenta de nuevo más tarde.", "error");
    }
});
