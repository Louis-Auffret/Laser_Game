const express = require("express");
const router = express.Router();
const db = require("../../config/database");

// Route pour ajouter un joueur
router.post("/players", (req, res) => {
    const { firstname, lastname, name } = req.body;

    if (!firstname || !lastname || !name) {
        return res.status(400).send("Tous les champs sont requis.");
    }

    // Étape 1 : Vérifier si le pseudo existe déjà
    const queryCheckName = "SELECT COUNT(*) AS count FROM PLAYERS WHERE name = ?";
    db.query(queryCheckName, [name], (err, result) => {
        if (err) {
            console.error("Erreur lors de la vérification du pseudo :", err);
            return res.status(500).send("Erreur serveur lors de la vérification du pseudo.");
        }

        const { count } = result[0];
        if (count > 0) {
            return res.status(400).send("Ce pseudo existe déjà. Veuillez en choisir un autre.");
        }

        // Étape 2 : Si le pseudo n'existe pas, insérer le joueur
        const queryInsertPlayer = `
        INSERT INTO PLAYERS (name, firstname, lastname) 
        VALUES (?, ?, ?);
      `;

        db.query(queryInsertPlayer, [name, firstname, lastname], (err, result) => {
            if (err) {
                console.error("Erreur lors de l'insertion du joueur :", err);
                return res.status(500).send("Erreur serveur lors de l'ajout du joueur.");
            }

            res.status(201).send("Joueur ajouté avec succès !");
        });
    });
});

//Route pour ajouter une équipe
router.post("/teams", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("Le nom de l'équipe est requis.");
    }

    // Étape 1 : Vérifier si le nom de l'équipe existe déjà
    const queryCheckName = "SELECT COUNT(*) AS count FROM TEAMS WHERE name = ?";
    db.query(queryCheckName, [name], (err, result) => {
        if (err) {
            console.error("Erreur lors de la vérification du nom de l'équipe :", err);
            return res.status(500).send("Erreur serveur lors de la vérification du nom de l'équipe.");
        }

        const { count } = result[0];
        if (count > 0) {
            return res.status(400).send("Ce nom d'équipe existe déjà. Veuillez en choisir un autre.");
        }

        // Étape 2 : Si le nom n'existe pas, insérer l'équipe
        const queryInsertTeam = `
        INSERT INTO TEAMS (name) 
        VALUES (?);
      `;

        db.query(queryInsertTeam, [name], (err, result) => {
            if (err) {
                console.error("Erreur lors de l'insertion de l'équipe :", err);
                return res.status(500).send("Erreur serveur lors de l'ajout de l'équipe.");
            }

            res.status(201).send("Équipe ajoutée avec succès !");
        });
    });
});

// Route pour récupérer les équipes
router.get("/teams", (req, res) => {
    const queryTeams = "SELECT id, name FROM TEAMS";

    db.query(queryTeams, (err, teams) => {
        if (err) {
            console.error("Erreur lors de la récupération des équipes :", err);
            return res.status(500).send("Erreur serveur lors de la récupération des équipes.");
        }
        res.json(teams);
    });
});

// Route pour récupérer les ligues
router.get("/leagues", (req, res) => {
    const queryLeagues = "SELECT id, name FROM LEAGUES";

    db.query(queryLeagues, (err, leagues) => {
        if (err) {
            console.error("Erreur lors de la récupération des ligues :", err);
            return res.status(500).send("Erreur serveur lors de la récupération des ligues.");
        }
        res.json(leagues);
    });
});

// Route pour associer une équipe à une ligue
router.post("/assign-team", (req, res) => {
    const { team_id, league_id } = req.body;

    if (!team_id || !league_id) {
        return res.status(400).send("L'équipe et la ligue sont requis.");
    }

    // Vérification si l'équipe est déjà inscrite dans cette ligue
    const checkTeamSeasonQuery = `
        SELECT id 
        FROM TEAM_SEASONS 
        WHERE team_id = ? AND league_id = ?;
    `;

    db.query(checkTeamSeasonQuery, [team_id, league_id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'existence de l'association :", err);
            return res.status(500).send("Erreur serveur lors de la vérification de l'existence de l'association.");
        }

        // Si une association existe déjà, renvoyer un message d'erreur
        if (result.length > 0) {
            return res.status(400).send("Cette équipe est déjà inscrite dans cette ligue.");
        }

        // Sinon, insérer dans TEAM_SEASONS
        const insertTeamSeasonQuery = `
            INSERT INTO TEAM_SEASONS (team_id, league_id) 
            VALUES (?, ?);
        `;

        db.query(insertTeamSeasonQuery, [team_id, league_id], (err, result) => {
            if (err) {
                console.error("Erreur lors de l'association de l'équipe à la ligue :", err);
                return res.status(500).send("Erreur serveur lors de l'association de l'équipe à la ligue.");
            }

            res.status(201).send("Équipe attribuée à la ligue avec succès !");
        });
    });
});

// Récupérer les équipes d'une ligue spécifique
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

module.exports = router;
