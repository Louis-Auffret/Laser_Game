const express = require("express");
const router = express.Router();
const db = require("../../config/database");

// Route pour récupérer les saisons
// router.get("/seasons", (req, res) => {
//     console.log("Route /SEASONS atteinte !");
//     const querySeasons = `
//         SELECT id, year
//         FROM SEASONS;
//     `;

//     db.query(querySeasons, (err, leagues) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).send("Erreur lors de la récupération des saisons");
//         }
//         res.json(leagues);
//     });
// });

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

// Récupérer les équipes d'une ligue spécifique ------------------------------------------------------------------------
router.get("/teams-by-league", (req, res) => {
    const leagueId = req.query.leagueId; // Récupérer l'ID de la ligue depuis la query string

    if (!leagueId) {
        return res.status(400).send("L'ID de la ligue est requis.");
    }

    const query = `
        SELECT t.id, t.name
        FROM TEAMS t
        INNER JOIN TEAM_SEASONS ts ON t.id = ts.team_id
        WHERE ts.league_id = ?;
    `;

    db.query(query, [leagueId], (err, teams) => {
        if (err) {
            return res.status(500).send("Erreur lors de la récupération des équipes.");
        }
        res.json(teams);
    });
});

// Route pour récupérer les joueurs d'une équipe pour une saison donnée ------------------------------------------------------------------------
router.get("/players", (req, res) => {
    const { teamId, leagueId } = req.query;
    const queryPlayers = `
        SELECT p.id, p.name
        FROM PLAYERS p
        INNER JOIN TEAM_PLAYERS tp ON p.id = tp.player_id
        INNER JOIN TEAM_SEASONS ts ON tp.team_season_id = ts.id
        INNER JOIN LEAGUES l ON ts.league_id = l.id
        WHERE ts.team_id = ? AND l.id = ? AND l.season_id = ?;
    `;

    db.query(queryPlayers, [teamId, leagueId], (err, players) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur lors de la récupération des joueurs");
        }
        res.json(players);
    });
});

module.exports = router;
