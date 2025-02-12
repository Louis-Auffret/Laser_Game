const express = require("express");
const router = express.Router();
const db = require("../../config/database");

// Route pour ajouter un joueur ------------------------------------------------------------------------
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

//Route pour ajouter une équipe ------------------------------------------------------------------------
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

// Route pour récupérer les équipes qui ne sont pas encore associées à une ligue ------------------------------------------------------------------------
router.get("/teams", (req, res) => {
    const queryTeams = `
        SELECT t.id, t.name 
        FROM TEAMS t
        LEFT JOIN TEAM_SEASONS ts ON t.id = ts.team_id
        WHERE ts.team_id IS NULL
    `;

    db.query(queryTeams, (err, teams) => {
        if (err) {
            console.error("Erreur lors de la récupération des équipes :", err);
            return res.status(500).send("Erreur serveur lors de la récupération des équipes.");
        }
        res.json(teams); // Retourne seulement les équipes non associées à une ligue
    });
});

// Route pour récupérer les joueurs qui ne sont pas encore associées à une équipe ------------------------------------------------------------------------
router.get("/unassigned-players", (req, res) => {
    const queryPlayers = `
        SELECT p.id, p.name 
        FROM PLAYERS p
        LEFT JOIN TEAM_PLAYERS tp ON p.id = tp.player_id
        WHERE tp.player_id IS NULL
    `;

    db.query(queryPlayers, (err, players) => {
        if (err) {
            console.error("Erreur lors de la récupération des joueurs non associés :", err);
            return res.status(500).send("Erreur serveur lors de la récupération des joueurs.");
        }
        res.json(players); // Retourne uniquement les joueurs qui ne sont pas associés à une équipe
    });
});

// Route pour récupérer les ligues ------------------------------------------------------------------------
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

// Route pour associer une équipe à une ligue ------------------------------------------------------------------------
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

// Route pour récupérer toutes les équipes déjà associées à une ligue ------------------------------------------------------------------------
router.get("/all-teams", (req, res) => {
    const queryTeams = `
        SELECT t.id, t.name 
        FROM TEAMS t
        INNER JOIN TEAM_SEASONS ts ON t.id = ts.team_id
        WHERE ts.team_id IS NOT NULL
    `;

    db.query(queryTeams, (err, teams) => {
        if (err) {
            console.error("Erreur lors de la récupération des équipes associées à une ligue :", err);
            return res.status(500).send("Erreur serveur lors de la récupération des équipes.");
        }
        res.json(teams); // Retourne toutes les équipes déjà associées à une ligue
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

// Route pour récupérer les joueurs d'une équipe spécifique ------------------------------------------------------------------------
router.get("/players-by-team", (req, res) => {
    const teamId = req.query.teamId; // Récupérer l'ID de l'équipe depuis la query string

    if (!teamId) {
        return res.status(400).send("L'ID de l'équipe est requis.");
    }

    // Requête pour récupérer les joueurs associés à l'équipe
    const queryPlayersByTeam = `
        SELECT p.id, p.name, p.firstname, p.lastname 
        FROM PLAYERS p
        INNER JOIN TEAM_PLAYERS tp ON p.id = tp.player_id
        INNER JOIN TEAM_SEASONS ts ON tp.team_season_id = ts.id
        WHERE ts.team_id = ?;
    `;

    db.query(queryPlayersByTeam, [teamId], (err, players) => {
        if (err) {
            console.error("Erreur lors de la récupération des joueurs de l'équipe :", err);
            return res.status(500).send("Erreur serveur lors de la récupération des joueurs.");
        }

        res.json(players); // Retourne les joueurs associés à l'équipe
    });
});

// Route pour récupérer tous les joueurs ------------------------------------------------------------------------
router.get("/all-players", (req, res) => {
    const queryPlayers = "SELECT id, name, firstname, lastname FROM PLAYERS";

    db.query(queryPlayers, (err, players) => {
        if (err) {
            console.error("Erreur lors de la récupération des joueurs :", err);
            return res.status(500).send("Erreur serveur lors de la récupération des joueurs.");
        }
        res.json(players); // Retourne la liste des joueurs
    });
});

// Route pour supprimer l'association d'une équipe à une ligue ------------------------------------------------------------------------
router.post("/remove-team", (req, res) => {
    const { league_id, team_id } = req.body;

    if (!league_id || !team_id) {
        return res.status(400).send("L'ID de la ligue et de l'équipe sont requis.");
    }

    console.log("Suppression de l'association pour team_id:", team_id, "et league_id:", league_id);

    // Supprimer l'association dans la table TEAM_SEASONS
    const queryDeleteAssociation = `
        DELETE FROM TEAM_SEASONS 
        WHERE team_id = ? AND league_id = ?;
    `;

    db.query(queryDeleteAssociation, [team_id, league_id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression de l'association :", err);
            return res.status(500).send("Erreur serveur lors de la suppression de l'association.");
        }

        console.log("Résultat de la requête SQL:", result);

        if (result.affectedRows === 0) {
            console.log("Aucune association trouvée pour cette équipe et cette ligue.");
            return res.status(404).send("Aucune association trouvée pour cette équipe et cette ligue.");
        }

        res.status(200).send("Association supprimée avec succès !");
    });
});

// Route pour ajouter un joueur à une équipe ------------------------------------------------------------------------
router.post("/assign-player", (req, res) => {
    console.log("Corps de la requête :", req.body);

    const { team_id, player_id, team_season_id, role_id } = req.body;

    if (!team_id || !player_id || !team_season_id || !role_id) {
        return res.status(400).send("L'ID de l'équipe, du joueur, de la saison d'équipe et du rôle sont requis.");
    }

    const teamId = parseInt(team_id);
    const playerId = parseInt(player_id);
    const teamSeasonId = parseInt(team_season_id);
    const roleId = parseInt(role_id);

    if (isNaN(teamId) || isNaN(playerId) || isNaN(teamSeasonId) || isNaN(roleId)) {
        return res.status(400).send("Les ID doivent être des entiers valides.");
    }

    // Vérifier que le team_season_id appartient bien à l'équipe
    const checkTeamSeasonQuery = `
        SELECT id FROM TEAM_SEASONS WHERE team_id = ? AND id = ?;
    `;
    db.query(checkTeamSeasonQuery, [teamId, teamSeasonId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la vérification de la saison d'équipe :", err);
            return res.status(500).send("Erreur serveur lors de la vérification de la saison d'équipe.");
        }

        if (result.length === 0) {
            return res.status(400).send("L'ID de la saison d'équipe est invalide ou ne correspond pas à l'équipe.");
        }

        // Vérifier si le joueur est déjà associé à l'équipe pour cette saison
        const checkTeamPlayerQuery = `
            SELECT * FROM TEAM_PLAYERS WHERE team_season_id = ? AND player_id = ?;
        `;
        db.query(checkTeamPlayerQuery, [teamSeasonId, playerId], (err, result) => {
            if (err) {
                console.error("Erreur lors de la vérification de l'association joueur-équipe :", err);
                return res.status(500).send("Erreur serveur lors de la vérification de l'association.");
            }

            if (result.length > 0) {
                return res.status(400).send("Ce joueur est déjà associé à cette équipe.");
            }

            // Insérer le joueur dans TEAM_PLAYERS avec le rôle
            const insertTeamPlayerQuery = `
                INSERT INTO TEAM_PLAYERS (team_season_id, player_id, role_id) 
                VALUES (?, ?, ?);
            `;
            db.query(insertTeamPlayerQuery, [teamSeasonId, playerId, roleId], (err, result) => {
                if (err) {
                    console.error("Erreur lors de l'ajout du joueur à l'équipe :", err);
                    return res.status(500).send("Erreur serveur lors de l'ajout du joueur à l'équipe.");
                }

                res.status(201).send("Joueur ajouté à l'équipe avec succès !");
            });
        });
    });
});

router.get("/get-team-season", (req, res) => {
    const { team_id } = req.query;

    if (!team_id) {
        return res.status(400).send("L'ID de l'équipe est requis.");
    }

    const query = `
        SELECT id AS team_season_id 
        FROM TEAM_SEASONS 
        WHERE team_id = ? 
        ORDER BY id DESC 
        LIMIT 1;
    `;

    db.query(query, [team_id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération de la saison d'équipe :", err);
            return res.status(500).send("Erreur serveur.");
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucune saison trouvée pour cette équipe." });
        }

        res.json(result[0]);
    });
});

// Route pour récupérer les rôles ------------------------------------------------------------------------
router.get("/get-roles", (req, res) => {
    const query = "SELECT id, name FROM ROLES ORDER BY name ASC";

    db.query(query, (err, result) => {
        if (err) {
            console.error("Erreur lors de la récupération des rôles :", err);
            return res.status(500).send("Erreur serveur.");
        }

        res.json(result);
    });
});

// Route pour supprimer un joueur d'une équipe ------------------------------------------------------------------------
router.post("/remove-player", (req, res) => {
    const { team_id, player_id } = req.body;

    if (!team_id || !player_id) {
        return res.status(400).send("L'ID de l'équipe et du joueur sont requis.");
    }

    // Supprimer l'association dans la table TEAM_PLAYERS
    const queryDeletePlayerAssociation = `
        DELETE FROM TEAM_PLAYERS 
        WHERE team_season_id = ? AND player_id = ?;
    `;
    db.query(queryDeletePlayerAssociation, [team_id, player_id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression de l'association joueur-équipe :", err);
            return res.status(500).send("Erreur serveur lors de la suppression de l'association.");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Aucune association trouvée pour ce joueur et cette équipe.");
        }

        res.status(200).send("Joueur supprimé de l'équipe avec succès !");
    });
});

module.exports = router;
