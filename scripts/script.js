if (!sessionStorage.getItem("logoAnimationPlayed")) {
    // Si l'animation n'a pas encore été jouée dans cette session
    setTimeout(() => {
        // Lancer l'animation et afficher le contenu
        document.getElementById("loader").style.display = "none";
        document.getElementById("content").style.display = "block";

        // Marquer que l'animation a été jouée pour cette session
        sessionStorage.setItem("logoAnimationPlayed", "true");
    }, 2600);
} else {
    // Si l'animation a déjà été jouée dans cette session, afficher directement le contenu
    document.getElementById("loader").style.display = "none";
    document.getElementById("content").style.display = "block";
}
