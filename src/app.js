const express = require("express");
const db = require("../config/database"); // Importe la connexion à la base de données

const app = express();

// Test de la base de données
app.get("/laser_game", (req, res) => {
    db.query("SELECT NOW() AS currentTime", (err, results) => {
        if (err) {
            console.error("Erreur lors de la requête SQL :", err);
            res.status(500).send("Erreur de connexion à la base de données");
            return;
        }
        res.send(`Connexion réussie ! Heure actuelle de la base : ${results[0].currentTime}`);
    });
});

// Lancer le serveur
app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000/laser_game");
});
