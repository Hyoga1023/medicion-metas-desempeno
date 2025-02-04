const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { writeFileSync, unlinkSync } = require('fs');

dotenv.config();

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'https://hyoga1023.github.io',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Manejar solicitudes OPTIONS para todas las rutas
app.options('*', cors(corsOptions));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

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

    // Validar que todos los campos estén presentes
    if (!usuario_inhouse || !tipo_id || !numero_id || !nombre_afiliado || !fecha || !observacion) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const sql = `
        INSERT INTO registros (usuario_inhouse, tipo_id, numero_id, nombre_afiliado, fecha, observacion)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [usuario_inhouse, tipo_id, numero_id, nombre_afiliado, fecha, observacion], (err, result) => {
        if (err) {
            console.error("Error al guardar datos:", err);
            return res.status(500).json({ error: "Error en el servidor al guardar los datos." });
        }
        res.status(200).json({ message: "Datos guardados correctamente." });
    });
});

// Ruta para borrar todos los registros
app.delete("/borrar-todo", (req, res) => {
    const sql = "DELETE FROM registros";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error al borrar los registros:", err);
            return res.status(500).json({ error: "Error en el servidor al borrar los registros." });
        }
        res.status(200).json({ message: "Todos los registros fueron borrados correctamente." });
    });
});

// Ruta para descargar los registros en un archivo CSV
app.get("/descargar", (req, res) => {
    const sql = "SELECT * FROM registros";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener los registros:", err);
            return res.status(500).json({ error: "Error en el servidor al obtener los registros." });
        }

        // Crear archivo CSV
        const csvContent = results.map(row => 
            Object.values(row).join(',')
        ).join('\n');

        const filePath = path.join(__dirname, 'registros.csv');

        // Escribir el archivo CSV en el sistema de archivos
        writeFileSync(filePath, csvContent);

        // Enviar el archivo al cliente
        res.download(filePath, "registros.csv", err => {
            if (err) {
                console.error("Error al enviar el archivo:", err);
            }
            unlinkSync(filePath); // Borra el archivo después de enviarlo
        });
    });
});

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});