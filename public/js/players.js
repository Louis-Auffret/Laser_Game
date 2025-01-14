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

// Fonction pour récupérer et afficher les équipes et joueurs d'une ligue
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
            teams.forEach((team) => {
                const teamDiv = document.createElement("div");
                teamDiv.classList.add("team");
                teamDiv.innerHTML = `<strong>${team.team_name}</strong>`; // Afficher le nom de l'équipe

                // Créer un volet pour afficher les joueurs
                const playerListDiv = document.createElement("div");
                playerListDiv.classList.add("player-list");
                playerListDiv.style.display = "none"; // Initialement masqué

                team.players.forEach((player) => {
                    const playerDiv = document.createElement("div");
                    playerDiv.classList.add("player");
                    playerDiv.textContent = player.player_name;
                    playerListDiv.appendChild(playerDiv);
                });

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

function goBackOnClick() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        console.warn("Aucune page précédente dans l'historique !");
        // Optionnel : Redirigez vers une autre page si nécessaire
        // window.location.href = "https://example.com";
    }
}
