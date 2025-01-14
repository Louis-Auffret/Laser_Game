const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Se connecter à MongoDB (remplace par ta propre chaîne de connexion)
mongoose
    .connect("mongodb://localhost:27017/maBaseDeDonnees", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connecté à MongoDB"))
    .catch((err) => console.log("Erreur de connexion à MongoDB:", err));

app.use(express.json());

// Exemple de route pour ajouter des données à la base
app.post("/ajouter-utilisateur", (req, res) => {
    const Utilisateur = mongoose.model(
        "Utilisateur",
        new mongoose.Schema({
            nom: String,
            email: String,
        })
    );

    const utilisateur = new Utilisateur({
        nom: req.body.nom,
        email: req.body.email,
    });

    utilisateur
        .save()
        .then(() => res.status(201).send("Utilisateur ajouté"))
        .catch((err) => res.status(400).send("Erreur : " + err));
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur écoute sur http://localhost:${port}`);
});
