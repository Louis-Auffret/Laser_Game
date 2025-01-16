const express = require("express");
const router = express.Router();
const db = require("../../config/database");

// Route pour récupérer les saisons
router.get("/seasons", (req, res) => {
    console.log("Route /SEASONS atteinte !");
    const querySeasons = `
        SELECT id, year, start_date, end_date 
        FROM SEASONS;
    `;

    db.query(querySeasons, (err, leagues) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur lors de la récupération des saisons");
        }
        res.json(leagues);
    });
});

// Route pour récupérer les ligues
router.get("/leagues", (req, res) => {
    console.log("Route /LEAGUES atteinte !");
    const queryLeagues = `
        SELECT id, name , season_id
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
