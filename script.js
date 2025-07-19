window.addEventListener("load",function(){

    let cardView = this.document.querySelector("#card-view");
    cardView.innerHTML="<h2>La carte s'affichera ici</h2>";

    // Charger les cartes
    fetch('./cards.json')
        .then(response => {
            if (!response.ok) throw new Error('Erreur de chargement');
            console.error("Erreur lors du chargement des cartes");
            return response.json();
        })
        .then(cards => {
            console.log('Cartes chargées :', cards);
            console.log('Nombre de cartes :', cards.length);
        })
    .catch(error => console.error(error));
})