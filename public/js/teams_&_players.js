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
            label.classList.add("filter");
            const radio = document.createElement("input");

            radio.type = "radio";
            radio.name = "league";
            radio.value = league.id;

            label.textContent = league.name;
            label.prepend(radio); // Ajouter le bouton radio avant le texte

            // Gestion de la classe .active
            radio.addEventListener("change", () => {
                // Supprime la classe .active de tous les labels
                document.querySelectorAll("#leagueButtons label").forEach((lbl) => {
                    lbl.classList.remove("active");
                });

                // Ajoute la classe .active au label actuel
                label.classList.add("active");
            });

            leagueButtons.appendChild(label);
        });
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Fonction pour récupérer et afficher les équipes et leurs joueurs d'une ligue donnée
async function fetchTeamsByLeague(leagueId) {
    teamList.innerHTML = ""; // Nettoyer la liste des équipes
    try {
        const response = await fetch(`http://localhost:3000/players/teams?leagueId=${leagueId}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des équipes");
        }

        const teams = await response.json();

        // Ajouter les équipes et leurs joueurs à la liste
        teams.forEach((team) => {
            const teamElement = document.createElement("div");
            teamElement.classList.add("team");

            // Nom de l'équipe
            const teamName = document.createElement("h3");
            teamName.textContent = team.name;
            teamName.classList.add("teamName");
            teamElement.appendChild(teamName);

            // Ajouter le conteneur de l'équipe au DOM
            teamList.appendChild(teamElement);

            // Liste des joueurs (masquée par défaut)
            const playerList = document.createElement("div");
            playerList.classList.add("playerList");
            playerList.style.display = "none"; // Masquer la liste initialement

            // Ajouter la section "teamHeading" à playerList
            const teamHeading = document.createElement("div");
            teamHeading.classList.add("teamHeading");

            // Liste des textes pour les <span>
            const spansContent = [
                "Rang",
                "Pseudo",
                "",
                "Matchs",
                "V",
                "D",
                "E",
                "",
                "MVP",
                "ATQ",
                "DEF",
                "",
                "Score",
                "Données",
                "Reçues",
            ];

            // Créer les <span> et les ajouter à "teamHeading"
            spansContent.forEach((content) => {
                const span = document.createElement("span");
                span.textContent = content; // Ajouter le texte
                teamHeading.appendChild(span); // Ajouter le <span> au conteneur
            });

            // Ajouter "teamHeading" à "playerList"
            playerList.appendChild(teamHeading);

            // Ajouter les joueurs à la liste
            team.players.forEach((player) => {
                const playerItem = document.createElement("div");
                playerItem.classList.add("player");
                playerItem.textContent = player.name;
                playerList.appendChild(playerItem);
            });

            // Ajouter playerList au DOM (après l'équipe)
            teamList.appendChild(playerList);

            // Ajouter un événement pour afficher/masquer les joueurs au clic
            teamElement.addEventListener("click", () => {
                playerList.style.display = playerList.style.display === "none" ? "block" : "none";
            });
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
