const express = require("express");
const db = require("../config/database");
const path = require("path");
const cors = require("cors");
const app = express();

// Activer CORS pour toutes les routes
app.use(cors());

//Importer Routes :
const playersRoutes = require("./routes/route_players");

// Servir le fichier HTML statiquement (index.html)
app.use(express.static(path.join(__dirname, "public")));

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

// Utiliser les routes des joueurs sous le chemin /players
app.use("/players", playersRoutes);

// Lancer le serveur
app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000/laser_game");
});
