// Fonction pour charger les ligues (reste inchangé)
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

// Fonction pour générer les matchs (confrontations)
function generateMatches() {
    const leagueId = document.getElementById("selectLeague").value;

    if (!leagueId) {
        alert("Veuillez sélectionner une ligue.");
        return;
    }

    // Récupérer les équipes de la ligue
    fetch(`http://localhost:3000/players/league/${leagueId}`)
        .then((response) => response.json())
        .then((teams) => {
            // Récupérer les noms des équipes
            const teamNames = teams.map((team) => team.team_name);

            // Créer toutes les confrontations possibles
            const matchups = [];
            for (let i = 0; i < teamNames.length; i++) {
                for (let j = i + 1; j < teamNames.length; j++) {
                    matchups.push({
                        id: `${teamNames[i]} vs ${teamNames[j]}`,
                        name1: teamNames[i],
                        name2: teamNames[j],
                    });
                }
            }

            // Créer le tableau avec 2 colonnes pour les salles
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
            // Diviser les matchs dans les deux salles
            for (let i = 0; i < matchups.length; i += 2) {
                const row = tbody.insertRow();
                const match1 = matchups[i] || "";
                const match2 = matchups[i + 1] || "";
                row.innerHTML = `
                    <td data-match-id="${match1.name1} vs ${match1.name2}">${match1.id}</td>
                    <td data-match-id="${match2.name1} vs ${match2.name2}">${match2.id}</td>
                `;
            }

            matchesContainer.appendChild(table);

            // Ajout d'un écouteur d'événements pour chaque cellule
            document.querySelectorAll("td[data-match-id]").forEach((cell) => {
                cell.addEventListener("click", (e) => {
                    const matchId = e.target.getAttribute("data-match-id");
                    openMatchPage(matchId); // Fonction définie ci-dessous
                });
            });
        })
        .catch((error) => console.error("Erreur lors du chargement des équipes :", error));
}

// Fonction pour ouvrir une page HTML spécifique
function openMatchPage(matchId) {
    const encodedMatchId = encodeURIComponent(matchId); // Encoder pour les espaces ou caractères spéciaux
    window.open(`/public/pages/match.html?match=${encodedMatchId}`, "_blank");
}

// Ajouter l'événement de clic pour le bouton "Générer rencontre"
document.getElementById("generateMatchesButton").addEventListener("click", generateMatches);

// Appel initial pour charger les ligues lorsque la page est prête
loadLeagues();
