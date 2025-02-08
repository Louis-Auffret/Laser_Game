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

    // Récupérer les équipes de la ligue avec la bonne route
    fetch(`http://localhost:3000/tourney/teams-by-league?leagueId=${leagueId}`)
        .then((response) => response.json())
        .then((teams) => {
            console.log("Équipes reçues :", teams); // Debugging

            if (!teams.length) {
                alert("Aucune équipe trouvée pour cette ligue.");
                return;
            }

            // Nettoyer les anciens matchs stockés avant d'en générer de nouveaux
            localStorage.removeItem("matchups");

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

            // Générer le tableau des matchs
            const matchesContainer = document.getElementById("matchesContainer");
            matchesContainer.innerHTML = ""; // Réinitialiser le contenu

            const table = document.createElement("table");
            table.classList.add("matches-table");

            const header = table.createTHead();
            const headerRow = header.insertRow();
            headerRow.innerHTML = `
                <th>Salle 1</th>
                <th>Salle 2</th>
            `;

            const tbody = table.createTBody();
            matchups.forEach((match) => {
                console.log(`Match: ${match.match}, Team 1 ID: ${match.team1Id}, Team 2 ID: ${match.team2Id}`);
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td><a href="#" onclick="openMatchPage(${match.team1Id}, ${match.team2Id})">${match.match}</a></td>
                    <td><a href="#" onclick="openMatchPage(${match.team1Id}, ${match.team2Id})">${match.match}</a></td>
                `;
            });

            matchesContainer.appendChild(table);
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
    headerRow.innerHTML = `<th>Salle 1</th><th>Salle 2</th>`;

    const tbody = table.createTBody();
    for (let i = 0; i < matchups.length; i += 2) {
        const row = tbody.insertRow();
        const match1 = matchups[i];
        const match2 = matchups[i + 1] || { team1Id: null, team2Id: null, match: "" };

        row.innerHTML = `
            <td>${
                match1.team1Id && match1.team2Id
                    ? `<a href="match.html?team1Id=${match1.team1Id}&team2Id=${match1.team2Id}">${match1.match}</a>`
                    : ""
            }</td>
            <td>${
                match2.team1Id && match2.team2Id
                    ? `<a href="match.html?team1Id=${match2.team1Id}&team2Id=${match2.team2Id}">${match2.match}</a>`
                    : ""
            }</td>
        `;
    }

    matchesContainer.appendChild(table);
}

// Charger les matchs depuis le localStorage au rechargement de la page
function loadStoredMatches() {
    const storedMatchups = JSON.parse(localStorage.getItem("matchups"));
    if (storedMatchups) {
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
