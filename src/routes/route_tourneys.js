const express = require("express");
const router = express.Router();
const db = require("../../config/database");

// Route pour récupérer les ligues
router.get("/leagues", (req, res) => {
    console.log("Route /leagues atteinte !");
    const queryLeagues = `
        SELECT id, name 
        FROM LEAGUES;
    `;

    db.query(queryLeagues, (err, leagues) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur lors de la récupération des ligues");
        }
        res.json(leagues);
    });
});

module.exports = router;
