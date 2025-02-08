// // Fonction pour récupérer les paramètres de l'URL
// function getUrlParameter(name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(name);
// }

// // Fonction pour charger les informations du match
// function loadMatchPage() {
//     const team1Id = getUrlParameter("team1Id");
//     const team2Id = getUrlParameter("team2Id");

//     if (!team1Id || !team2Id) {
//         alert("Erreur : Impossible de charger les équipes.");
//         return;
//     }

//     // Charger les informations des équipes et de leurs joueurs
//     fetch(`http://localhost:3000/players/team/${team1Id}`)
//         .then((response) => response.json())
//         .then((team1Players) => {
//             // Vérifier si les joueurs de l'équipe 1 sont chargés correctement
//             if (!team1Players || team1Players.length === 0) {
//                 throw new Error("Aucun joueur trouvé pour l'équipe 1");
//             }

//             // Charger l'équipe 2 et ses joueurs
//             fetch(`http://localhost:3000/players/team/${team2Id}`)
//                 .then((response) => response.json())
//                 .then((team2Players) => {
//                     // Vérifier si les joueurs de l'équipe 2 sont chargés correctement
//                     if (!team2Players || team2Players.length === 0) {
//                         throw new Error("Aucun joueur trouvé pour l'équipe 2");
//                     }

//                     const matchDetails = document.getElementById("matchDetails");
//                     matchDetails.innerHTML = `
//                         <h2>Match: ${team1Players[0].team_name} vs ${team2Players[0].team_name}</h2>
//                     `;

//                     // Affichage du formulaire de match
//                     const matchForm = document.getElementById("matchForm");
//                     matchForm.innerHTML = `
//                         <table>
//                             <tr>
//                                 <th>Equipe 1</th>
//                                 <th>Equipe 2</th>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     <ul id="team1PlayersList">
//                                         ${team1Players
//                                             .map((player) => {
//                                                 return `<li>${player.name} - <input type="number" placeholder="Touches Données" id="touches1_${player.id}" />
//                                                         <input type="number" placeholder="Touches Reçues" id="recues1_${player.id}" /></li>`;
//                                             })
//                                             .join("")}
//                                     </ul>
//                                 </td>
//                                 <td>
//                                     <ul id="team2PlayersList">
//                                         ${team2Players
//                                             .map((player) => {
//                                                 return `<li>${player.name} - <input type="number" placeholder="Touches Données" id="touches2_${player.id}" />
//                                                         <input type="number" placeholder="Touches Reçues" id="recues2_${player.id}" /></li>`;
//                                             })
//                                             .join("")}
//                                     </ul>
//                                 </td>
//                             </tr>
//                         </table>
//                         <button onclick="submitMatch()">Soumettre</button>
//                     `;
//                 })
//                 .catch((error) => console.error("Erreur lors du chargement des joueurs de l'équipe 2:", error));
//         })
//         .catch((error) => console.error("Erreur lors du chargement des joueurs de l'équipe 1:", error));
// }

// // Fonction pour soumettre les résultats du match
// function submitMatch() {
//     // Récupérer les données des inputs (touches données et touches reçues)
//     const team1Id = getUrlParameter("team1Id");
//     const team2Id = getUrlParameter("team2Id");

//     const team1Results = [];
//     const team2Results = [];

//     // Récupérer les données de chaque joueur (touches données et reçues)
//     document.querySelectorAll("#matchForm ul li").forEach((playerElem, index) => {
//         const playerId = index + 1; // ID du joueur (commence à 1)

//         // Vérifier si le joueur fait partie de l'équipe 1
//         if (playerElem.querySelector('input[id^="touches1"]')) {
//             const touches = document.getElementById(`touches1_${playerId}`).value;
//             const recues = document.getElementById(`recues1_${playerId}`).value;
//             team1Results.push({ playerId, touches, recues });
//         }

//         // Vérifier si le joueur fait partie de l'équipe 2
//         if (playerElem.querySelector('input[id^="touches2"]')) {
//             const touches = document.getElementById(`touches2_${playerId}`).value;
//             const recues = document.getElementById(`recues2_${playerId}`).value;
//             team2Results.push({ playerId, touches, recues });
//         }
//     });

//     // Envoyer les résultats au serveur (à l'API pour mettre à jour la base de données)
//     fetch("http://localhost:3000/matchResults", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             team1Id,
//             team2Id,
//             team1Results,
//             team2Results,
//         }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             alert("Match soumis avec succès !");
//             console.log("Données envoyées avec succès :", data);
//         })
//         .catch((error) => {
//             console.error("Erreur lors de la soumission des résultats :", error);
//             alert("Erreur lors de la soumission des résultats.");
//         });
// }

// // Charger la page du match
// loadMatchPage();

// // Charger les joueurs au chargement de la page
// document.addEventListener("DOMContentLoaded", loadPlayers);

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
    displayMatchDetails(team1Name, team2Name);
});

function displayMatchDetails(team1Name, team2Name) {
    const container = document.getElementById("matchDetailsContainer");

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

    // Ajouter une ligne vide pour les joueurs (pour l'instant, on ne met rien dedans)
    const row = table.insertRow();
    row.innerHTML = `
        <td></td>
        <td></td>
    `;

    // Ajouter le tableau dans le conteneur
    container.appendChild(table);
}
