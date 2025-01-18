// Fonction pour ajouter un joueur
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
            alert(errorMessage); // Affiche le message d'erreur spécifique
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout du joueur :", error);
        alert("Erreur lors de l'ajout du joueur.");
    }
});

// Fonction pour ajouter une équipe
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

// Fonction pour remplir les selects des équipes et ligues
document.addEventListener("DOMContentLoaded", async () => {
    // Récupérer la liste des équipes et ligues depuis le serveur
    const [teamsResponse, leaguesResponse] = await Promise.all([
        fetch("http://localhost:3000/admin/teams"), // Cette route renvoie déjà les équipes non associées à une ligue
        fetch("http://localhost:3000/admin/leagues"),
    ]);

    const teams = await teamsResponse.json(); // Ce tableau contient uniquement les équipes non associées
    const leagues = await leaguesResponse.json();

    // Trier les équipes par leur nom avant de les ajouter au select
    const sortedTeams = teams.sort((a, b) => a.name.localeCompare(b.name));

    // Peupler le select des équipes pour assigner une équipe à une ligue
    const teamSelectAssign = document.getElementById("team-assign");
    sortedTeams.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelectAssign.appendChild(option);
    });

    // Peupler le select des ligues pour assigner une équipe à une ligue
    const leagueSelectAssign = document.getElementById("league-assign");
    leagues.forEach((league) => {
        const option = document.createElement("option");
        option.value = league.id;
        option.textContent = league.name;
        leagueSelectAssign.appendChild(option);
    });

    // Peupler le select des ligues pour supprimer l'association
    const leagueSelectRemove = document.getElementById("league-remove");
    leagues.forEach((league) => {
        const option = document.createElement("option");
        option.value = league.id;
        option.textContent = league.name;
        leagueSelectRemove.appendChild(option);
    });
});

// Lorsqu'une ligue est sélectionnée dans la section suppression, récupérer et afficher les équipes associées
document.getElementById("league-remove").addEventListener("change", async (e) => {
    const leagueId = e.target.value;

    if (leagueId) {
        // Récupérer les équipes associées à la ligue sélectionnée pour suppression
        const response = await fetch(`http://localhost:3000/admin/teams-by-league?leagueId=${leagueId}`);
        const teams = await response.json();

        // Trier les équipes par leur nom
        const sortedTeams = teams.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Vider le select des équipes
        const teamSelectRemove = document.getElementById("team-remove");
        teamSelectRemove.innerHTML = "<option value=''>Sélectionner une équipe</option>"; // Remettre l'option par défaut

        // Ajouter les équipes triées au select
        sortedTeams.forEach((team) => {
            const option = document.createElement("option");
            option.value = team.id;
            option.textContent = team.name;
            teamSelectRemove.appendChild(option);
        });
    } else {
        // Si aucune ligue n'est sélectionnée, vider le select des équipes
        document.getElementById("team-remove").innerHTML = "<option value=''>Sélectionner une équipe</option>";
    }
});

// Fonction pour assigner une équipe à une ligue
document.getElementById("assign-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const teamId = document.getElementById("team-assign").value;
    const leagueId = document.getElementById("league-assign").value;

    // Assurez-vous que teamId et leagueId ne sont pas vides
    if (!teamId || !leagueId) {
        alert("Veuillez sélectionner une équipe et une ligue.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/admin/assign-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team_id: teamId, league_id: leagueId }),
        });

        if (response.ok) {
            alert("Équipe attribuée à la ligue avec succès !");

            // Après l'assignation, on met à jour le select des équipes
            const teamSelectAssign = document.getElementById("team-assign");

            // Supprimer l'option de l'équipe assignée
            const teamOptions = Array.from(teamSelectAssign.options);
            const teamOptionToRemove = teamOptions.find((option) => option.value === teamId);
            if (teamOptionToRemove) {
                teamSelectAssign.removeChild(teamOptionToRemove);
            }
        } else {
            const errorMessage = await response.text();
            alert(errorMessage); // Afficher l'erreur du serveur
        }
    } catch (error) {
        console.error("Erreur lors de l'assignation de l'équipe :", error);
        alert("Erreur lors de l'assignation de l'équipe.");
    }
});

// Fonction pour supprimer l'association équipe-ligue
document.getElementById("remove-team-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const leagueId = document.getElementById("league-remove").value;
    const teamId = document.getElementById("team-remove").value;

    // Vérifiez si une ligue et une équipe ont été sélectionnées
    if (!leagueId || !teamId) {
        alert("Veuillez sélectionner une ligue et une équipe.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/admin/remove-team", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ league_id: leagueId, team_id: teamId }),
        });

        const responseText = await response.text();

        if (response.ok) {
            alert("Association supprimée avec succès !");
            console.log("Réponse du serveur:", responseText);

            // Mettre à jour les deux selects (team-assign et team-remove) après la suppression
            await updateTeamSelectsAfterRemoval(leagueId);
        } else {
            alert("Erreur : " + responseText);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de l'association :", error);
        alert("Erreur lors de la suppression de l'association.");
    }
});

// Fonction pour mettre à jour les selects #team-assign et #team-remove après suppression
async function updateTeamSelectsAfterRemoval(leagueId) {
    // Mise à jour du select des équipes à assigner (team-assign)
    const teamSelectAssign = document.getElementById("team-assign");

    // Récupérer les équipes déjà associées (route /teams)
    const teamsResponse = await fetch("http://localhost:3000/admin/teams");
    const teams = await teamsResponse.json();

    // Trier les équipes associées par leur nom
    const sortedTeams = teams.sort((a, b) => a.name.localeCompare(b.name));

    // Vider le select des équipes à assigner
    teamSelectAssign.innerHTML = ""; // Retirer toutes les options existantes

    // Ajouter les équipes triées au select #team-assign
    sortedTeams.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelectAssign.appendChild(option);
    });

    // Mise à jour du select des équipes à supprimer (team-remove)
    const teamSelectRemove = document.getElementById("team-remove");

    // Récupérer les équipes associées à la ligue sélectionnée pour suppression (route /teams-by-league)
    const response = await fetch(`http://localhost:3000/admin/teams-by-league?leagueId=${leagueId}`);
    const teamsInLeague = await response.json();

    // Trier les équipes associées à la ligue par leur nom
    const sortedTeamsInLeague = teamsInLeague.sort((a, b) => a.name.localeCompare(b.name));

    // Vider le select des équipes à supprimer
    teamSelectRemove.innerHTML = "<option value=''>Sélectionner une équipe</option>"; // Remettre l'option par défaut

    // Ajouter les équipes associées dans le select #team-remove
    sortedTeamsInLeague.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.name;
        teamSelectRemove.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const assignPlayerForm = document.getElementById("assign-player-form");
    const removePlayerForm = document.getElementById("remove-player-form");

    // Fonction pour trier les objets par le champ 'name'
    function sortByName(items) {
        return items.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
    }

    // Fonction pour récupérer les équipes
    function fetchTeams() {
        fetch("http://localhost:3000/admin/all-teams")
            .then((response) => response.json())
            .then((teams) => {
                const teamSelectAssign = document.getElementById("team-assign-player");
                const teamSelectRemove = document.getElementById("team-remove-player");

                const sortedTeams = sortByName(teams);

                teamSelectAssign.innerHTML = '<option value="">Sélectionner une équipe</option>';
                teamSelectRemove.innerHTML = '<option value="">Sélectionner une équipe</option>';

                sortedTeams.forEach((team) => {
                    const optionAssign = document.createElement("option");
                    optionAssign.value = team.id;
                    optionAssign.textContent = team.name;
                    teamSelectAssign.appendChild(optionAssign);

                    const optionRemove = document.createElement("option");
                    optionRemove.value = team.id;
                    optionRemove.textContent = team.name;
                    teamSelectRemove.appendChild(optionRemove);
                });
            })
            .catch((err) => console.error("Erreur lors de la récupération des équipes :", err));
    }

    // Fonction pour récupérer tous les joueurs (pour le select assign-player)
    function fetchAllPlayers() {
        fetch("http://localhost:3000/admin/all-players")
            .then((response) => response.json())
            .then((players) => {
                console.log("All players fetched:", players);

                const playerAssignSelect = document.getElementById("player-assign");

                const sortedPlayers = sortByName(players);

                playerAssignSelect.innerHTML = '<option value="">Sélectionner un joueur</option>';
                sortedPlayers.forEach((player) => {
                    const option = document.createElement("option");
                    option.value = player.id;
                    option.textContent = `${player.name} (${player.firstname} ${player.lastname})`;
                    playerAssignSelect.appendChild(option);
                });
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des joueurs :", error);
            });
    }

    // Fonction pour récupérer les joueurs d'une équipe spécifique (pour le select remove-player)
    function fetchPlayersByTeam(teamId) {
        if (!teamId) {
            document.getElementById("player-remove").innerHTML = '<option value="">Sélectionner un joueur</option>';
            return;
        }

        fetch(`http://localhost:3000/admin/players-by-team?teamId=${teamId}`)
            .then((response) => response.json())
            .then((players) => {
                console.log("Players fetched for team:", players);

                const playerRemoveSelect = document.getElementById("player-remove");

                const sortedPlayers = sortByName(players);

                playerRemoveSelect.innerHTML = '<option value="">Sélectionner un joueur</option>';
                sortedPlayers.forEach((player) => {
                    const option = document.createElement("option");
                    option.value = player.id;
                    option.textContent = `${player.name} (${player.firstname} ${player.lastname})`;
                    playerRemoveSelect.appendChild(option);
                });
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des joueurs de l'équipe :", error);
            });
    }

    // Fonction pour assigner un joueur à une équipe
    function assignPlayerToTeam(event) {
        event.preventDefault();

        const teamId = document.getElementById("team-assign-player").value;
        const playerId = document.getElementById("player-assign").value;

        if (!teamId || !playerId) {
            alert("Veuillez sélectionner une équipe et un joueur.");
            return;
        }

        fetch("http://localhost:3000/admin/assign-player", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ team_id: teamId, player_id: playerId }),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Le joueur a été ajouté à l'équipe !");
                    assignPlayerForm.reset();
                } else {
                    response.text().then((message) => alert(message));
                }
            })
            .catch((err) => {
                console.error("Erreur lors de l'assignation du joueur :", err);
                alert("Une erreur est survenue.");
            });
    }

    // Fonction pour supprimer un joueur d'une équipe
    function removePlayerFromTeam(event) {
        event.preventDefault();

        const teamId = document.getElementById("team-remove-player").value;
        const playerId = document.getElementById("player-remove").value;

        if (!teamId || !playerId) {
            alert("Veuillez sélectionner une équipe et un joueur.");
            return;
        }

        fetch("http://localhost:3000/admin/remove-player", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ team_id: teamId, player_id: playerId }),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Le joueur a été supprimé de l'équipe !");
                    removePlayerForm.reset();
                } else {
                    response.text().then((message) => alert(message));
                }
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression du joueur :", err);
                alert("Une erreur est survenue.");
            });
    }

    assignPlayerForm.addEventListener("submit", assignPlayerToTeam);
    removePlayerForm.addEventListener("submit", removePlayerFromTeam);

    fetchTeams();
    fetchAllPlayers();

    document.getElementById("team-remove-player").addEventListener("change", function () {
        const teamId = this.value;
        fetchPlayersByTeam(teamId);
    });
});
