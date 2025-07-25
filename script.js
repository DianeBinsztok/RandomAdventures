window.addEventListener("load",function(){

    // Le bouton
    const drawBtn = document.querySelector("#draw-button");
    // L'affichage de la carte
    const cardView = document.querySelector("#card-view");

    // Le bouton pour garder la carte dans le deck
    const keepBtn = document.querySelector("#keep-in-deck");
    let keep = false;

    // Le bouton pour rejouer
    const resetBtn = document.querySelector("#reset-deck");

    // La carte courante : aucune carte n'est affichée au lancement du jeu
    let currentCard = null;


    // CHARGER LES CARTES
    fetch('./cards.json')
        .then(response => {
            if (!response.ok){
                console.error("Erreur lors du chargement des cartes");
                throw new Error('Erreur de chargement');
            } 
            return response.json();
        })
        .then(cards => {

            // Copier le tableau reçu dans un nouveau tableau
            let deck = [...cards];
            console.log("deck :", deck);

            // Affichage de départ, avec un deck plein et pas de carte courante
            handleDisplay(deck, currentCard, keepBtn, drawBtn, resetBtn, cardView);

            // BOUTON KEEP - VARIABLE KEEP : GARDER LA CARTE COURANTE OU NON
            keepBtn.addEventListener("click", ()=>{
                keepBtn.classList.toggle("active");
                console.log('keepBtn :', keepBtn);
                keep = keepBtn.classList.contains("active");
                console.log('keep :', keep);
            })

            // BOUTON RESET : RÉAFFECTER LE TABLEAU DECK POUR RELANCER LA PARTIE
            resetBtn.addEventListener("click", ()=>{
                deck = [...cards];
                console.log('deck :', deck);
                console.log('currentCard :', currentCard);

                currentCard = null;
                console.log('currentCard :', currentCard);
                handleDisplay(deck, currentCard, keepBtn, drawBtn, resetBtn, cardView);
            })
            // TIRAGE ALÉATOIRE:

            // Au clic sur le bouton,
            drawBtn.addEventListener("click", ()=>{
                // Tirer une nouvelle carte
                draw(deck);
            });

            // Au clic sur la barre d'espace
            addEventListener("keydown", (event)=>{
                // Vérifier que c'est bien la barre d'espace qui est pressée
                if (event.key == " " || event.code == "Space") {
                    // Éviter le scroll
                    event.preventDefault();
                    // Tirer une nouvelle carte
                    draw(deck);
                }
            });

            // Version mobile : au swipe sur la carte(dans n'importe quel sens)
            cardView.addEventListener('touchend', ()=>{
                // Tirer une nouvelle carte
                draw(deck);
            }, false); 

            // Fonction qui rassemble les fonctions de tirage
            function draw(deck){

                if(deck.length>0){ 
                    console.log("deck.length avant défausse:", deck.length);
                   
                    // Défausser la carte précédente s'il y en a une et que le mode 'keep' n'est pas sélectionné
                    discardOrKeepPreviousCard(deck, currentCard, keep);
                    console.log("deck.length après défausse:", deck.length);


                    // Tirer une nouvelle carte
                    currentCard = drawNewRandomCard(deck);

                }
                // Affichage
                handleDisplay(deck, currentCard, keepBtn, drawBtn, resetBtn, cardView);

                keep = false;
            }
        })
    .catch(error => console.error(error));
})

// FONCTIONS
// Tirage aléatoire : renvoie une carte du deck
function drawNewRandomCard(cardsArray){

    // Si le deck comporte encore des cartes
    if(cardsArray.length>0){

        // Générer un index aléatoire dans les limites du nombre de cartes du deck
        let nbOfCards = cardsArray.length;
        let randomIndex = Math.floor(Math.random() * nbOfCards);

        // Tirer la carte à l'index généré
        let newRandomCard = cardsArray[randomIndex];

        return newRandomCard;
    }else{
        // Si le deck est vide, on ne renvoie rien
        return null;
    }
}

// Afficher la carte tirée s'il y en a une
function displayRandomCardOrMessage(option, displayZone, cardToDisplay){

    switch (option) {

        case "start":
        displayZone.innerHTML = "<h2>Votre carte s'affichera ici</h2>";
        break;

        case "current":
        displayZone.innerHTML = "<img id='current-card' src='./"+cardToDisplay.imgUrl+"'/>";
        break;

        case "empty":
        displayZone.innerHTML = "<p>Votre deck est vide !</p>";
        break;

        default:
            break;
    }
}

// Défausser ou garder la carte précédente
function discardOrKeepPreviousCard(deck, previousCard, keep){
    if(previousCard && deck.indexOf(previousCard)!=-1 && !keep){
        deck.splice(deck.indexOf(previousCard), 1);
        console.log("deck après défausse :", deck);
    }
}

// Affichage : La carte courante - ou le message - et les boutons
function handleDisplay(deck, currentCard, keepButton, drawButton, resetButton, displayZone){
    // I - DÉBUT : LE DECK EST PLEIN MAIS PAS DE CARTE COURANTE 
    if(deck.length>0 && !currentCard){
        console.log("deck.length>0 && !currentCard");

        // L'affichage du tapis
        displayZone.innerHTML = "<h2>Votre carte s'affichera ici</h2>";

        // Les boutons
        keepButton.classList.add("hide");
        drawButton.classList.remove("hide");
        resetButton.classList.add("hide");
    }
    
    // II - IL RESTE DES CARTES DANS LE DECK ET UNE CARTE COURANTE
    if(deck.length>0 && currentCard){
        console.log("deck.length>0 && currentCard");

        // L'affichage du tapis
        displayZone.innerHTML = "<img id='current-card' src='./"+currentCard.imgUrl+"'/>";

        // Les boutons
        keepButton.classList.remove("hide");
        drawButton.classList.remove("hide");
    }

    // III - LE DECK EST VIDE
    if(deck.length<=0){
        console.log("deck.length <=0");

        // L'affichage du tapis
        displayZone.innerHTML = "<p>Votre deck est vide !</p>";

        // Les boutons
        keepButton.classList.add("hide");
        drawButton.classList.add("hide");
        resetButton.classList.remove("hide");
    }

    // Remettre la valeur de keep à false pour le nouveau tour
    keepButton.classList.remove("active");

    // Retirer le focus des boutons pour éviter son déclenchement au spacebar
    drawButton.blur();
    keepButton.blur();
}