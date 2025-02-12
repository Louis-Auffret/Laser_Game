document.addEventListener("DOMContentLoaded", () => {
    // Récupérer les paramètres de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const team1Id = urlParams.get("team1Id");
    const team2Id = urlParams.get("team2Id");
    const leagueId = urlParams.get("leagueId");
    const team1Name = urlParams.get("team1Name");
    const team2Name = urlParams.get("team2Name");

    // Vérification des paramètres récupérés
    console.log("Paramètres de l'URL:", { team1Id, team2Id, leagueId, team1Name, team2Name });

    if (!team1Id || !team2Id || !leagueId || !team1Name || !team2Name) {
        alert("Paramètres manquants !");
        return;
    }

    // Si tout est correct, on génère un tableau avec les noms des équipes
    loadPlayers(team1Id, team2Id, leagueId, team1Name, team2Name);
});

function loadPlayers(team1Id, team2Id, leagueId, team1Name, team2Name) {
    // Appel à l'API pour récupérer les joueurs des deux équipes
    Promise.all([
        fetch(`http://localhost:3000/players?teamId=${team1Id}&leagueId=${leagueId}`).then((response) =>
            response.json()
        ),
        fetch(`http://localhost:3000/players?teamId=${team2Id}&leagueId=${leagueId}`).then((response) =>
            response.json()
        ),
    ])
        .then(([players1, players2]) => {
            if (!players1 || !players2) {
                alert("Erreur lors du chargement des joueurs.");
                return;
            }

            // Ensuite, afficher les détails du match avec les joueurs
            displayMatchDetails(players1, players2, team1Name, team2Name);
        })
        .catch((error) => {
            console.error("Erreur lors du chargement des joueurs :", error);
        });
}

function displayMatchDetails(players1, players2, team1Name, team2Name) {
    const container = document.getElementById("matchDetailsContainer");

    // Vérifier que le conteneur existe
    if (!container) {
        alert("Conteneur non trouvé !");
        return;
    }

    // Créer le tableau des détails du match
    const table = document.createElement("table");
    table.classList.add("matches-table");

    // Créer une ligne d'en-tête avec les noms des équipes
    const headerRow = table.insertRow();
    headerRow.innerHTML = `
        <th>${team1Name}</th>
        <th>${team2Name}</th>
    `;

    // Déterminer la longueur maximale des deux listes de joueurs pour équilibrer les lignes
    const maxLength = Math.max(players1.length, players2.length);

    // Remplir le tableau avec les joueurs
    for (let i = 0; i < maxLength; i++) {
        const row = table.insertRow();

        // Ajouter un joueur de la première équipe (si présent)
        const player1Name = players1[i] ? players1[i].name : "";
        const player2Name = players2[i] ? players2[i].name : "";

        row.innerHTML = `
            <td>${player1Name}</td>
            <td>${player2Name}</td>
        `;
    }

    // Ajouter le tableau dans le conteneur
    container.appendChild(table);
}
