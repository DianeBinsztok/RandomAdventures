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

            // Garder en mémoire la précédente carte tirée : 
            let currentCardIndex = null;
            // Au clic sur le bouton,
            drawBtn.addEventListener("click", ()=>{

                // appeler drawRandomCard pour sortir une carte aléatoire : index et url
                let drawObject = drawRandomCard(cards, currentCardIndex);

                // - l'url pour afficher la carte,
                let randomCardImgUrl = drawObject.imgUrl;
                // - l'index pour mémoriser l'index de la carte courante
                currentCardIndex = drawObject.newIndex;
                
                // et afficher la carte
                cardView.innerHTML="<img src='./"+randomCardImgUrl+"'/>";
            });
        })
    .catch(error => console.error(error));
})

// FONCTION DE TIRAGE ALÉATOIRE DANS LE DECK
function drawRandomCard(cardsArray, currentIndex){

    //Générer un index aléatoire dans les limites du nombre de cartes
    let nbOfCards = cardsArray.length;
    let randomIndex = Math.floor(Math.random() * nbOfCards);
    console.log("randomIndex :", randomIndex);

    // Si le nouvel index est le même que celui de la carte courante,
    if(randomIndex == currentIndex){
        console.log("Doublon ! Je tire une autre carte");
        // refaire un tirage
        return drawRandomCard(cardsArray, currentIndex);
    }else{
        // Renvoyer le nouvel index et l'url de la carte
        return {"newIndex":randomIndex, "imgUrl":cardsArray[randomIndex].imgUrl}
    }
}