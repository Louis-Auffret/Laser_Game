// Fonction pour ajouter un joueur
document.getElementById("add-player-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const playerData = {
        firstname: formData.get("firstname"),
        lastname: formData.get("lastname"),
        name: formData.get("name"),
    };

    try {
        const response = await fetch("http://localhost:3000/admin/players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData),
        });

        if (response.ok) {
            alert("Joueur ajouté avec succès !");
            e.target.reset(); // Réinitialiser le formulaire
        } else {
            const errorMessage = await response.text(); // Récupère le message d'erreur du serveur
            alert(errorMessage); // Affiche le message d'erreur spécifique (ex. pseudo déjà existant)
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du joueur :", error);
        alert("Erreur lors de l'ajout du joueur.");
    }
});

// Fonction pour ajouter une équipe
document.getElementById("add-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const teamData = {
        name: formData.get("name"),
    };

    try {
        const response = await fetch("http://localhost:3000/admin/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teamData),
        });

        if (response.ok) {
            alert("Équipe ajoutée avec succès !");
            e.target.reset(); // Réinitialiser le formulaire
        } else {
            const errorMessage = await response.text(); // Récupère le message d'erreur du serveur
            alert(errorMessage); // Affiche le message d'erreur spécifique
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'équipe :", error);
        alert("Erreur lors de l'ajout de l'équipe.");
    }
});

// Lors du chargement du DOM, remplir les listes des équipes et ligues
document.addEventListener("DOMContentLoaded", async () => {
    // Récupérer la liste des équipes et ligues depuis le serveur
    const [teamsResponse, leaguesResponse] = await Promise.all([
        fetch("http://localhost:3000/admin/teams"), // Cette route récupère maintenant les équipes non assignées
        fetch("http://localhost:3000/admin/leagues"),
    ]);

    const teams = await teamsResponse.json();
    const leagues = await leaguesResponse.json();

    // Peupler le select des équipes pour assigner une équipe à une ligue
    const teamSelectAssign = document.getElementById("team-assign");
    teams.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelectAssign.appendChild(option);
    });

    // Peupler le select des ligues pour assigner une équipe à une ligue
    const leagueSelectAssign = document.getElementById("league-assign");
    leagues.forEach((league) => {
        const option = document.createElement("option");
        option.value = league.id;
        option.textContent = league.name;
        leagueSelectAssign.appendChild(option);
    });

    // Peupler le select des ligues pour supprimer l'association
    const leagueSelectRemove = document.getElementById("league-remove");
    leagues.forEach((league) => {
        const option = document.createElement("option");
        option.value = league.id;
        option.textContent = league.name;
        leagueSelectRemove.appendChild(option);
    });
});

// Lorsqu'une ligue est sélectionnée dans la section suppression, récupérer et afficher les équipes associées
document.getElementById("league-remove").addEventListener("change", async (e) => {
    const leagueId = e.target.value;

    if (leagueId) {
        // Récupérer les équipes associées à la ligue sélectionnée pour suppression
        const response = await fetch(`http://localhost:3000/admin/teams-by-league?leagueId=${leagueId}`);
        const teams = await response.json();

        // Vider le select des équipes
        const teamSelectRemove = document.getElementById("team-remove");
        teamSelectRemove.innerHTML = "<option value=''>Sélectionner une équipe</option>"; // Remettre l'option par défaut

        // Ajouter les équipes au select
        teams.forEach((team) => {
            const option = document.createElement("option");
            option.value = team.id;
            option.textContent = team.name;
            teamSelectRemove.appendChild(option);
        });
    } else {
        // Si aucune ligue n'est sélectionnée, vider le select des équipes
        document.getElementById("team-remove").innerHTML = "<option value=''>Sélectionner une équipe</option>";
    }
});

// Fonction pour assigner une équipe à une ligue
document.getElementById("assign-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const teamId = document.getElementById("team-assign").value; // Utilisation de l'élément avec id "team-assign"
    const leagueId = document.getElementById("league-assign").value; // Utilisation de l'élément avec id "league-assign"

    // Assurez-vous que teamId et leagueId ne sont pas vides
    if (!teamId || !leagueId) {
        alert("Veuillez sélectionner une équipe et une ligue.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/admin/assign-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team_id: teamId, league_id: leagueId }),
        });

        if (response.ok) {
            alert("Équipe attribuée à la ligue avec succès !");
        } else {
            const errorMessage = await response.text();
            alert(errorMessage); // Afficher l'erreur du serveur
        }
    } catch (error) {
        console.error("Erreur lors de l'assignation de l'équipe :", error);
        alert("Erreur lors de l'assignation de l'équipe.");
    }
});

// Fonction pour ajouter un joueur à une équipe dans une saison
document.getElementById("add-player-to-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const playerId = formData.get("player");
    const teamSeasonId = formData.get("team-season");

    try {
        const response = await fetch("http://localhost:3000/admin/team-players", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id: playerId,
                team_season_id: teamSeasonId,
            }),
        });

        if (response.ok) {
            alert("Joueur ajouté à l'équipe avec succès !");
            e.target.reset(); // Réinitialiser le formulaire
        } else {
            const errorMessage = await response.text(); // Récupère le message d'erreur du serveur
            alert(errorMessage); // Affiche le message d'erreur spécifique
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du joueur à l'équipe :", error);
        alert("Erreur lors de l'ajout du joueur.");
    }
});

// Lors du chargement du DOM, remplir les listes des équipes et des joueurs
document.addEventListener("DOMContentLoaded", async () => {
    // Récupérer la liste des équipes et ligues depuis le serveur
    const [teamsResponse, playersResponse, seasonsResponse] = await Promise.all([
        fetch("http://localhost:3000/admin/teams"),
        fetch("http://localhost:3000/admin/players"),
        fetch("http://localhost:3000/admin/seasons"),
    ]);

    const teams = await teamsResponse.json();
    const players = await playersResponse.json();
    const seasons = await seasonsResponse.json();

    // Peupler le select des joueurs
    const playerSelect = document.getElementById("player");
    players.forEach((player) => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = `${player.firstname} ${player.lastname}`;
        playerSelect.appendChild(option);
    });

    // Peupler le select des équipes par saison
    const teamSeasonSelect = document.getElementById("team-season");
    teams.forEach((team) => {
        // Associer chaque équipe à une saison spécifique
        seasons.forEach((season) => {
            const option = document.createElement("option");
            option.value = `${team.id}_${season.id}`; // Format: team_id_season_id
            option.textContent = `${team.name} - Saison ${season.year}`;
            teamSeasonSelect.appendChild(option);
        });
    });
});
