//Fonction pour ajouter un joueur
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

//Fonction pour ajouter une équipe
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

document.addEventListener("DOMContentLoaded", async () => {
    // Récupérer la liste des équipes et ligues depuis le serveur
    const [teamsResponse, leaguesResponse] = await Promise.all([
        fetch("http://localhost:3000/admin/teams"),
        fetch("http://localhost:3000/admin/leagues"),
    ]);

    const teams = await teamsResponse.json();
    const leagues = await leaguesResponse.json();

    // Peupler le select des équipes
    const teamSelect = document.getElementById("team");
    teams.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });

    // Peupler le select des ligues
    const leagueSelect = document.getElementById("league");
    leagues.forEach((league) => {
        const option = document.createElement("option");
        option.value = league.id;
        option.textContent = league.name;
        leagueSelect.appendChild(option);
    });
});

document.getElementById("assign-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const teamId = document.getElementById("team").value;
    const leagueId = document.getElementById("league").value;

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
});
