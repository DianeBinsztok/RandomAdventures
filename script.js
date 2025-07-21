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
                let newRandomCard = drawRandomCardThenDiscardIt(cards);

                // Afficher la carte (ou le message si le deck est vide)
                displayRandomCardOrMessage(cardView, newRandomCard);

                // Retirer le focus du bouton pour éviter son déclenchement au spacebar
                drawBtn.blur();
            });

            // Au clic sur la barre d'espace
            addEventListener("keydown", (event)=>{

                // Vérifier que c'est bien la barre d'espace qui est pressée
                if (event.key == " " || event.code == "Space") {

                    // Éviter le scrolldown (par défaut quand on presse 'espace')
                    event.preventDefault();

                    // Appeler drawRandomCard pour sortir une carte aléatoire                
                    let newRandomCard = drawRandomCardThenDiscardIt(cards);

                    // Afficher la carte (ou le message si le deck est vide)
                    displayRandomCardOrMessage(cardView, newRandomCard);   
                }
            });

            // Version mobile : au swipe sur la carte(dans n'importe quel sens)
            cardView.addEventListener('touchend', ()=>{

                // Appeler drawRandomCard pour sortir une carte aléatoire                
                let newRandomCard = drawRandomCardThenDiscardIt(cards);

                // Afficher la carte (ou le message si le deck est vide)
                displayRandomCardOrMessage(cardView, newRandomCard);
            }, false); 
        })
    .catch(error => console.error(error));
})

// FONCTIONS
// Tirage aléatoire sans remise
function drawRandomCardThenDiscardIt(cardsArray){

    // Si le deck comporte encore des cartes
    if(cardsArray.length>0){
        //Générer un index aléatoire dans les limites du nombre de cartes du deck
        let nbOfCards = cardsArray.length;
        let randomIndex = Math.floor(Math.random() * nbOfCards);

        // Tirer la carte à l'index généré
        let newRandomCard = cardsArray[randomIndex];

        // Défausser la carte en la retirant du tableau
        cardsArray.splice(randomIndex, 1);
        return newRandomCard;
    }else{
        // Si le deck est vide, on ne renvoie rien
        return null;
    }
}

// Afficher la carte tirée s'il y en a une
function displayRandomCardOrMessage(displayArea, cardToDisplay){
    // Afficher la carte, s'il en a une
    if(cardToDisplay){
        displayArea.innerHTML="<img src='./"+cardToDisplay.imgUrl+"'/>";
                
    // Sinon, afficher un message
    }else{
        displayArea.innerHTML="<p>Votre deck est vide !</p>";
    }
}
