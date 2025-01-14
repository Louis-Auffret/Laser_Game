// Fonction pour récupérer les joueurs de l'équipe spécifiée
function fetchPlayers() {
    const teamId = document.getElementById("teamId").value;
    const playerListDiv = document.getElementById("playerList");

    // Vider la liste des joueurs avant de charger les nouveaux résultats
    playerListDiv.innerHTML = "";

    if (!teamId) {
        playerListDiv.innerHTML = "Veuillez entrer un ID d'équipe.";
        return;
    }

    // Requête GET vers votre API pour récupérer les joueurs
    fetch(`http://localhost:3000/players/team/${teamId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Équipe non trouvée ou problème avec l'API");
            }
            return response.json();
        })
        .then((players) => {
            if (players.length === 0) {
                playerListDiv.innerHTML = "Aucun joueur trouvé pour cette équipe.";
            } else {
                players.forEach((player) => {
                    const playerDiv = document.createElement("div");
                    playerDiv.classList.add("player");
                    playerDiv.textContent = player.player_name;
                    playerListDiv.appendChild(playerDiv);
                });
            }
        })
        .catch((error) => {
            playerListDiv.innerHTML = `Erreur: ${error.message}`;
        });
}

//------------------------------------------------------------------------------------------
function filterLeague(leagueId) {
    const teamListDiv = document.getElementById("teamList");
    teamListDiv.innerHTML = ""; // Réinitialiser la liste des équipes

    // Réinitialiser la classe active sur tous les boutons radio
    const leagueButtons = document.querySelectorAll("input[name='league']");
    leagueButtons.forEach((button) => {
        button.parentElement.classList.remove("active");
    });

    // Ajouter la classe active sur le bouton radio sélectionné
    const selectedButton = document.getElementById(`league${leagueId}`);
    selectedButton.parentElement.classList.add("active");

    // Requête pour récupérer les équipes et leurs joueurs de la ligue sélectionnée
    fetch(`http://localhost:3000/players/league/${leagueId}`)
        .then((response) => response.json())
        .then((teams) => {
            // Trier les équipes par teamScore (teamPoints) de manière décroissante
            teams.sort((a, b) => {
                const scoreA = a.victories * 2 + a.draws;
                const scoreB = b.victories * 2 + b.draws;
                return scoreB - scoreA;
            });

            // Calculer le rang de chaque équipe après le tri
            teams.forEach((team, index) => {
                team.rank = index + 1; // Le rang commence à 1
            });

            teams.forEach((team) => {
                const teamDiv = document.createElement("div");
                teamDiv.classList.add("team");

                // Calcul du score total des joueurs de l'équipe
                const totalScore = team.players.reduce((total, player) => {
                    return total + (player.donnees - player.recues);
                }, 0); // Somme des scores des joueurs (donnees - recues)
                const teamPoints = team.victories * 2 + team.draws;
                const totalDonnees = team.players.reduce((total, player) => total + player.donnees, 0);
                const totalRecues = team.players.reduce((total, player) => total + player.recues, 0);

                // Affichage du nom de l'équipe et de son score venant de SEASONS
                teamDiv.innerHTML = `
                    <span class="team-rank">#${team.rank}</span>
                    <strong class="team-name">${team.team_name}</strong> 
                    <span class="team-points">${teamPoints}<span class="light">pts</span></span>
                    <span class="filler">|</span>
                    <span class="team-victories">${team.victories}</span>
                    <span class="team-defeats">${team.defeats}</span>
                    <span class="team-draws">${team.draws}</span>
                    <span class="filler">|</span>
                    <span class="team-score">${totalScore}</span>
                    <span class="team-donnees">${totalDonnees}</span>
                    <span class="team-recues">${totalRecues}</span>`;

                // Créer un volet pour afficher les joueurs
                const playerListDiv = document.createElement("div");
                playerListDiv.classList.add("player-list");
                playerListDiv.style.display = "none"; // Initialement masqué

                // Ajouter les joueurs dans le volet
                if (team.players && team.players.length > 0) {
                    team.players.forEach((player) => {
                        const playerDiv = document.createElement("div");
                        playerDiv.classList.add("player");

                        // Afficher le nom du joueur et son score
                        playerDiv.innerHTML = `<span>${player.player_name}</span> 
                                               <span class="score">${player.donnees - player.recues}</span> 
                                               <span class="donnees">${player.donnees}</span> 
                                               <span class="recues">${player.recues}</span> 
                                               <span class="rank_mvp"></span> 
                                               <span class="rank_atq"></span> 
                                               <span class="rank_def"></span>`;

                        playerListDiv.appendChild(playerDiv);
                    });
                } else {
                    const noPlayersMessage = document.createElement("div");
                    noPlayersMessage.innerText = "Aucun joueur disponible";
                    playerListDiv.appendChild(noPlayersMessage);
                }

                // Ajouter la gestion du clic pour afficher/masquer les joueurs
                teamDiv.onclick = function () {
                    playerListDiv.style.display = playerListDiv.style.display === "none" ? "block" : "none";
                };

                // Ajouter l'équipe et ses joueurs à la liste
                teamListDiv.appendChild(teamDiv);
                teamListDiv.appendChild(playerListDiv);
            });
        })
        .catch((error) => console.error("Erreur:", error));
}

//* ------------------------------------------------------------------------------------------
function goBackOnClick() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        console.warn("Aucune page précédente dans l'historique !");
        // window.location.href = "https://example.com"; //Optionnel, rediriger vers un lien
    }
}
