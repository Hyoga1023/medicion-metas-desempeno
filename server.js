require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
        return;
    }
    console.log("Conectado a la base de datos.");
});

// Ruta para guardar datos
app.post("/guardar", (req, res) => {
    const { usuario_inhouse, tipo_id, numero_id, nombre_afiliado, fecha, observacion } = req.body;
    const sql = `
        INSERT INTO registros (usuario_inhouse, tipo_id, numero_id, nombre_afiliado, fecha, observacion)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [usuario_inhouse, tipo_id, numero_id, nombre_afiliado, fecha, observacion], (err, result) => {
        if (err) {
            console.error("Error al guardar datos:", err);
            res.status(500).send("Error en el servidor.");
            return;
        }
        res.status(200).send("Datos guardados correctamente.");
    });
});

// Ruta para borrar todos los registros
app.delete("/borrar-todo", (req, res) => {
    const sql = "DELETE FROM registros";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al borrar los registros:", err);
            res.status(500).send("Error en el servidor.");
            return;
        }
        res.status(200).send("Todos los registros fueron borrados correctamente.");
    });
});

// Ruta para descargar los registros en un archivo CSV
app.get("/descargar", (req, res) => {
    const sql = "SELECT * FROM registros";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener los registros:", err);
            return res.status(500).send("Error en el servidor.");
        }

        // Crear archivo CSV
        const filePath = path.join(__dirname, "registros.csv");
        const csvContent = results.map(r => Object.values(r).join(",")).join("\n");

        // Escribir el archivo CSV en el sistema de archivos
        fs.writeFileSync(filePath, csvContent);

        // Enviar el archivo al cliente
        res.download(filePath, "registros.csv", err => {
            if (err) {
                console.error("Error al enviar el archivo:", err);
            }
            fs.unlinkSync(filePath); // Borra el archivo después de enviarlo
        });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
