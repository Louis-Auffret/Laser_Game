const mysql = require("mysql2");
require("dotenv").config(); // Charge les variables d'environnement du fichier .env

// Configuration de la connexion
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "nouvel_utilisateur",
    password: process.env.DB_PASSWORD || "mot_de_passe",
    database: process.env.DB_NAME || "nom_de_ta_base",
});

// Test de la connexion
connection.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données :", err);
        return;
    }
    console.log("Connexion réussie à la base de données !");
});

module.exports = connection;
