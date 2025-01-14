const express = require("express");
const router = express.Router();
const db = require("../../config/database"); // Assurez-vous d'importer votre module DB

// Route pour récupérer les joueurs de l'équipe avec l'ID donné
router.get("/team/:teamId", (req, res) => {
    const teamId = req.params.teamId; // ID de l'équipe passé dans l'URL

    // Requête SQL pour récupérer les joueurs de l'équipe spécifiée
    const query = `
      SELECT p.name AS player_name
      FROM PLAYERS p
      WHERE p.team_id = ?;  -- Utilisation de l'ID de l'équipe dans la condition WHERE
    `;

    db.query(query, [teamId], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Erreur lors de la récupération des joueurs");
        } else {
            res.json(result); // Envoie les résultats sous forme de JSON
        }
    });
});

// Route pour récupérer les équipes et leurs joueurs associés selon la ligue
router.get("/league/:leagueId", (req, res) => {
    console.log("Route /league/:leagueId atteinte !");
    const leagueId = req.params.leagueId; // ID de la ligue passé dans l'URL
    console.log(`Ligue ID : ${leagueId}`);

    // Requête SQL pour récupérer les équipes d'une ligue
    const queryTeams = `
        SELECT t.id AS team_id, t.name AS team_name
        FROM TEAMS t
        WHERE t.league_id = ?;
    `;

    db.query(queryTeams, [leagueId], (err, teams) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur lors de la récupération des équipes");
        }

        // Si des équipes sont trouvées, récupérer les joueurs pour chaque équipe
        const queryPlayers = `
            SELECT p.id AS player_id, p.name AS player_name, p.team_id
            FROM PLAYERS p
            WHERE p.team_id IN (?);
        `;

        const teamIds = teams.map((team) => team.team_id);

        // Passer les ids des équipes dans la requête
        db.query(queryPlayers, [teamIds], (err, players) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erreur lors de la récupération des joueurs");
            }

            // Regrouper les joueurs par équipe
            const teamsWithPlayers = teams.map((team) => {
                team.players = players.filter((player) => player.team_id === team.team_id);
                return team;
            });

            res.json(teamsWithPlayers); // Retourner les équipes avec leurs joueurs
        });
    });
});

module.exports = router;
