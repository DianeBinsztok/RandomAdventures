window.addEventListener("load",function(){

    // Le bouton
    let drawBtn = this.document.querySelector("#draw-button");
    // L'affichage de la carte
    let cardView = this.document.querySelector("#card-view");
    // Si aucune carte n'est tirée, afficher un tapis ou autre ...
    cardView.innerHTML="<h2>La carte s'affichera ici</h2>";

    // CHARGER LES CARTES
    fetch('./cards.json')
        .then(response => {
            if (!response.ok) throw new Error('Erreur de chargement');
            console.error("Erreur lors du chargement des cartes");
            return response.json();
        })
        .then(cards => {
            console.log('Cartes chargées :', cards);
            console.log('Nombre de cartes :', cards.length);

            // TIRAGE ALÉATOIRE:
            // Au clic sur le bouton,
            drawBtn.addEventListener("click", ()=>{
                // appeler drawRandomCard pour sortir une carte aléatoire
                let randomCardImgUrl = drawRandomCard(cards);
                // et afficher la carte
                cardView.innerHTML="<img src='./"+randomCardImgUrl+"'/>";
            });
        })
    .catch(error => console.error(error));
})

// FONCTION DE TIRAGE ALÉATOIRE DANS LE DECK
function drawRandomCard(cardsArray){

    //Générer un index aléatoire dans les limites du nombre de cartes
    let nbOfCards = cardsArray.length;
    let randomIndex = Math.floor(Math.random() * nbOfCards);
    console.log("randomIndex :", randomIndex);

    //Récupérer l'url de l'image de la carte tirée
    let randomCardImgUrl = cardsArray[randomIndex];
    return randomCardImgUrl;
}
