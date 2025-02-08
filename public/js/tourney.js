// Fonction pour charger les ligues
function loadLeagues() {
    const selectLeague = document.getElementById("selectLeague");

    fetch("http://localhost:3000/tourney/leagues")
        .then((response) => response.json())
        .then((leagues) => {
            leagues.forEach((league) => {
                const option = document.createElement("option");
                option.value = league.id;
                option.textContent = league.name;
                selectLeague.appendChild(option);
            });

            // Restaurer la sélection de la ligue
            const savedLeague = localStorage.getItem("selectedLeague");
            if (savedLeague) {
                selectLeague.value = savedLeague;
            }
        })
        .catch((error) => console.error("Erreur lors du chargement des ligues:", error));
}

// Fonction pour générer les matchs
function generateMatches() {
    const leagueId = document.getElementById("selectLeague").value;

    if (!leagueId) {
        alert("Veuillez sélectionner une ligue.");
        return;
    }

    // Demander confirmation à l'utilisateur
    const confirmation = window.confirm(
        "Êtes-vous sûr de vouloir générer de nouveaux matchs ? Cela écrasera le tableau actuel."
    );
    if (!confirmation) {
        return; // Si l'utilisateur annule, on arrête la fonction
    }

    // Sauvegarde de la ligue sélectionnée
    localStorage.setItem("selectedLeague", leagueId);

    // Appel API pour obtenir les équipes de la ligue sélectionnée
    fetch(`http://localhost:3000/tourney/teams-by-league?leagueId=${leagueId}`)
        .then((response) => response.json())
        .then((teams) => {
            console.log("Équipes reçues :", teams);

            if (!teams.length) {
                alert("Aucune équipe trouvée pour cette ligue.");
                return;
            }

            const teamNames = teams.map((team) => team.name);
            const teamIds = teams.map((team) => team.id);

            // Créer toutes les confrontations possibles
            const matchups = [];
            for (let i = 0; i < teamNames.length; i++) {
                for (let j = i + 1; j < teamNames.length; j++) {
                    matchups.push({
                        match: `${teamNames[i]} vs ${teamNames[j]}`,
                        team1Id: teamIds[i],
                        team2Id: teamIds[j],
                    });
                }
            }

            // Sauvegarder les matchs dans le localStorage
            localStorage.setItem("matchups", JSON.stringify(matchups));

            // Appel de la fonction pour afficher les matchs avec les bons paramètres
            displayMatches(matchups, leagueId);
        })
        .catch((error) => console.error("Erreur lors du chargement des équipes :", error));
}

// Fonction pour afficher les matchs dans un tableau
function displayMatches(matchups) {
    const matchesContainer = document.getElementById("matchesContainer");
    matchesContainer.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("matches-table");

    const header = table.createTHead();
    const headerRow = header.insertRow();
    headerRow.innerHTML = `<th>Salle A</th><th>Salle B</th>`;

    const tbody = table.createTBody();
    for (let i = 0; i < matchups.length; i++) {
        const row = tbody.insertRow();
        const match = matchups[i];

        // Récupérer l'ID de la ligue depuis le select
        const leagueId = document.getElementById("selectLeague").value;

        // Vérifier que l'ID de la ligue est présent
        if (!leagueId) {
            console.error("ID de la ligue manquant !");
            continue; // Passer à la prochaine confrontation si la ligue n'est pas définie
        }

        // Ajouter les noms d'équipe dans l'URL
        row.innerHTML = `
            <td><a href="match.html?team1Id=${match.team1Id}&team2Id=${match.team2Id}&leagueId=${leagueId}&team1Name=${
            match.match.split(" vs ")[0]
        }&team2Name=${match.match.split(" vs ")[1]}">${match.match}</a></td>
            <td><a href="match.html?team1Id=${match.team1Id}&team2Id=${match.team2Id}&leagueId=${leagueId}&team1Name=${
            match.match.split(" vs ")[0]
        }&team2Name=${match.match.split(" vs ")[1]}">${match.match}</a></td>
        `;
    }

    matchesContainer.appendChild(table);
}

// Charger les matchs depuis le localStorage au rechargement de la page
function loadStoredMatches() {
    const storedMatchups = JSON.parse(localStorage.getItem("matchups"));
    if (storedMatchups && storedMatchups.length > 0) {
        displayMatches(storedMatchups);
    }
}

// Ajouter l'événement pour générer les matchs
document.getElementById("generateMatchesButton").addEventListener("click", generateMatches);

// Charger les ligues et restaurer les matchs au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    loadLeagues();
    loadStoredMatches();
});
