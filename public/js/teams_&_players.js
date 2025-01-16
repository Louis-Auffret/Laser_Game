// Sélecteurs
const seasonSelect = document.getElementById("seasonSelect");
const leagueButtons = document.getElementById("leagueButtons");
const teamList = document.getElementById("teamList");

// Fonction pour récupérer et remplir les saisons
async function fetchSeasons() {
    try {
        const response = await fetch("http://localhost:3000/players/seasons");
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des saisons");
        }

        const seasons = await response.json();

        // Ajouter les options au select
        seasons.forEach((season) => {
            const option = document.createElement("option");
            option.value = season.id;
            option.textContent = `${season.year}`;
            seasonSelect.appendChild(option);
        });

        // Sélectionner automatiquement la première saison et charger les ligues
        if (seasons.length > 0) {
            seasonSelect.value = seasons[0].id; // Sélectionner la première saison
            fetchLeaguesBySeason(seasons[0].id); // Charger les ligues pour la saison sélectionnée
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Fonction pour récupérer et afficher les ligues d'une saison donnée
async function fetchLeaguesBySeason(seasonId) {
    teamList.innerHTML = ""; // Nettoyer la liste des équipes
    try {
        const response = await fetch(`http://localhost:3000/players/leagues?seasonId=${seasonId}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des ligues");
        }

        const leagues = await response.json();

        // Nettoyer les anciens boutons radio
        leagueButtons.innerHTML = "";

        // Ajouter les boutons radio
        leagues.forEach((league) => {
            const label = document.createElement("label");
            const radio = document.createElement("input");

            radio.type = "radio";
            radio.name = "league";
            radio.value = league.id;

            label.textContent = league.name;
            label.prepend(radio); // Ajouter le bouton radio avant le texte

            leagueButtons.appendChild(label);
        });
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Fonction pour récupérer et afficher les équipes d'une ligue et saison données
async function fetchTeamsByLeague(leagueId) {
    teamList.innerHTML = "";
    try {
        const response = await fetch(`http://localhost:3000/players/teams?leagueId=${leagueId}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des équipes");
        }

        const teams = await response.json();

        // Ajouter les équipes à la liste
        teams.forEach((team) => {
            const teamElement = document.createElement("div");
            teamElement.textContent = team.name;
            teamElement.classList.add("team");
            teamList.appendChild(teamElement);
        });
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Écoutez les clics sur les boutons radio des ligues
leagueButtons.addEventListener("change", (event) => {
    const selectedRadio = event.target;
    if (selectedRadio.name === "league") {
        const leagueId = selectedRadio.value;
        fetchTeamsByLeague(leagueId);
    }
});

// Événement pour charger les ligues quand une saison est sélectionnée
seasonSelect.addEventListener("change", (event) => {
    const seasonId = event.target.value;
    fetchLeaguesBySeason(seasonId);
});

// Charger les saisons au démarrage
document.addEventListener("DOMContentLoaded", fetchSeasons);
