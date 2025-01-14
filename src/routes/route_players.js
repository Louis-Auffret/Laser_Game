const express = require("express");
const router = express.Router();
const db = require("../../config/database");

// Route pour récupérer les équipes et leurs joueurs associés selon la ligue
router.get("/league/:leagueId", (req, res) => {
    console.log("Route /league/:leagueId atteinte !");
    const leagueId = req.params.leagueId; // ID de la ligue passé dans l'URL
    console.log(`Ligue ID : ${leagueId}`);

    // Requête SQL pour récupérer les équipes d'une ligue avec leurs informations de saison
    const queryTeams = `
        SELECT 
            t.id AS team_id, 
            t.name AS team_name, 
            s.victories, 
            s.defeats, 
            s.draws
        FROM TEAMS t
        LEFT JOIN SEASONS s ON s.team_id = t.id
        WHERE t.league_id = ?;
    `;

    db.query(queryTeams, [leagueId], (err, teams) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erreur lors de la récupération des équipes");
        }

        // Si des équipes sont trouvées, récupérer les joueurs pour chaque équipe
        const queryPlayers = `
            SELECT 
                p.id AS player_id, 
                p.name AS player_name, 
                p.touches_donnees AS donnees, 
                p.touches_recues AS recues, 
                p.team_id
            FROM PLAYERS p
            WHERE p.team_id IN (?);
        `;

        const teamIds = teams.map((team) => team.team_id);

        // Passer les ids des équipes dans la requête pour récupérer les joueurs
        db.query(queryPlayers, [teamIds], (err, players) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Erreur lors de la récupération des joueurs");
            }

            // Regrouper les joueurs par équipe
            teams.forEach((team) => {
                team.players = players.filter((player) => player.team_id === team.team_id);
            });

            // Retourner les équipes avec leurs joueurs
            res.json(teams);
        });
    });
});

module.exports = router;
