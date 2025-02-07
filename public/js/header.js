class MyHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
            <nav>
                <ul>
                    <img src="../../assets/logo_complet.svg" alt="Logo" />
                    <li><a href="/public/home.html">Accueil</a></li>
                    <li><a href="/public/pages/admin.html">Admin</a></li>
                    <li><a href="/public/pages/teams_&_players.html">Classements</a></li>
                    <li><a href="/public/pages/tourney.html">Tournois</a></li>
                    <li><a href="/public/pages/about.html">A propos</a></li>
                </ul>
            </nav>
        </header>`;
    }
}

customElements.define("my-header", MyHeader);
