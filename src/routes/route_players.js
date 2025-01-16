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
    const seasonId = req.query.seasonId; // Récupère l'ID de la saison depuis la query string

    const queryLeagues = `
        SELECT id, name, season_id
        FROM LEAGUES
        WHERE season_id = ?;
    `;

    db.query(queryLeagues, [seasonId], (err, leagues) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur lors de la récupération des ligues");
        }
        res.json(leagues);
    });
});

//Route pour récupérer les équipes
router.get("/teams", (req, res) => {
    const { leagueId } = req.query;

    // Récupérer la saison associée à la ligue
    const querySeasonForLeague = `
        SELECT season_id
        FROM LEAGUES
        WHERE id = ?;
    `;

    db.query(querySeasonForLeague, [leagueId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erreur lors de la récupération de la saison de la ligue");
        }

        if (results.length === 0) {
            return res.status(404).send("Ligue non trouvée");
        }

        const seasonId = results[0].season_id;

        // Maintenant, on peut récupérer les équipes associées à cette ligue et saison
        const queryTeams = `
        SELECT t.id, t.name
        FROM TEAMS t
        INNER JOIN TEAM_SEASONS ts ON t.id = ts.team_id
        INNER JOIN LEAGUES l ON ts.league_id = l.id
        WHERE l.id = ? AND l.season_id = ?;
    `;

        db.query(queryTeams, [leagueId, seasonId], (err, teams) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erreur lors de la récupération des équipes");
            }
            res.json(teams);
        });
    });
});

// Route pour récupérer les joueurs d'une équipe pour une saison donnée
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
