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

            // TIRAGE ALÉATOIRE:

            // Au clic sur le bouton,
            drawBtn.addEventListener("click", ()=>{

                // Appeler drawRandomCard pour sortir une carte aléatoire                
                let newRandomCardUrl = drawRandomCardNoDouble(cards);

                // S'il reste des cartes dans le deck, afficher une carte aléatoire
                if(newRandomCardUrl){
                    cardView.innerHTML="<img src='./"+newRandomCardUrl.imgUrl+"'/>";
                }else{
                    cardView.innerHTML="<p>Votre deck est vide !</p>";
                }
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

// FONCTION DE TIRAGE ALÉATOIRE DANS LE DECK - SANS REMISE
// S'il reste des cartes dans le deck, newRandomCardUrl renvoie une carte, sinon, la fonction renvoie null
function drawRandomCardNoDouble(cardsArray){

    if(cardsArray.length>0){
        //Générer un index aléatoire dans les limites du nombre de cartes du deck
        let nbOfCards = cardsArray.length;
        let randomIndex = Math.floor(Math.random() * nbOfCards);
        console.log("randomIndex :", randomIndex);
        
        let newRandomCard = cardsArray[randomIndex];
        console.log("newRandomCard: ", newRandomCard);

        cardsArray.splice(randomIndex, 1);
        console.log("cardsArray après suppression : ", cardsArray);
        return newRandomCard;
    }else{
        return null;
    }

}