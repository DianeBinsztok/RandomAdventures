/* ======= VARIABLES DE MODULE ======= */

// Élément d'interface : Les boutons et le tapis
let drawBtn, keepBtn, resetBtn, cardView;

// Une zone plus large pour tirer au swipe sur un écran tactile
let main;

// Les cartes récupérées après un fetch
let cards = [];
// La pioche
let deck = [];

// La carte courante : aucune carte n'est affichée au lancement du jeu
let currentCard = null;

// Garder ou non la carte courante : inutilisé au début de la partie
let keep = false;

/* ======= LANCEMENT DE LA PARTIE ======= */

window.addEventListener("load",init);


/* ======= FONCTIONS ======= */

function init(){

    /* I - VALEURS DE DÉPART */

    /* Les boutons */
    // - Tirer une nouvelle carte
    drawBtn = document.querySelector("#draw-button");
    // - Garder la carte dans le deck
    keepBtn = document.querySelector("#keep-in-deck");
    // - Rejouer
    resetBtn = document.querySelector("#reset-deck");

    /* Le tapis */        
    cardView = document.querySelector("#card-view");
    /* Prendre une zone plus large pour tirer les cartes au swipe sur écrans tactiles*/
    main = document.querySelector("main");

    /* CHARGER LES CARTES */
    fetch('./cards.json')
        .then(response => {
            if (!response.ok){
                console.error("Erreur lors du chargement des cartes");
                throw new Error('Erreur de chargement');
            } 
            return response.json();
        })
        .then(data => {

            // Copier le tableau reçu dans un nouveau tableau
            cards = [...data];
            deck = [...cards];

            // Activer les boutons
            setEventListeners();

            // Affichage
            handleDisplay(deck, currentCard, keepBtn, drawBtn, resetBtn, cardView);

        })
    .catch(error => console.error(error));

}

// EVENTLISTENERS : ACTIVER LES BOUTONS
function setEventListeners(){

    // TIRAGE ALÉATOIRE:
    // - Au clic sur le bouton,
    drawBtn.addEventListener("click", draw);

    // - Au clic sur la barre d'espace
    window.addEventListener("keydown", (event)=>{
        // Vérifier que c'est bien la barre d'espace qui est pressée
        if (event.key == " " || event.code == "Space") {
            // Éviter le scroll
            event.preventDefault();
            // Tirer une nouvelle carte
            draw();
        }
    });

    // - Version mobile : au swipe sur la carte(dans n'importe quel sens)
    main.addEventListener('touchend', draw, false); 

    // BOUTON KEEP - VARIABLE KEEP : GARDER LA CARTE COURANTE OU NON
    keepBtn.addEventListener("click", ()=>{
        keepBtn.classList.toggle("active");
        keep = keepBtn.classList.contains("active");
    })

    // BOUTON RESET : RÉAFFECTER LE TABLEAU DECK POUR RELANCER LA PARTIE
    resetBtn.addEventListener("click", resetGame);
}

// TIRAGE DE CARTE (RASSEMBLE TOUTES LES FONCTIONS DE TIRAGE)
function draw(){

    if(deck.length>0){         
        // Défausser la carte précédente s'il y en a une et que le mode 'keep' n'est pas sélectionné
        discardOrKeepPreviousCard(deck, currentCard, keep);

        // Tirer une nouvelle carte
        currentCard = drawNewRandomCard(deck);
    }
    // Affichage
    handleDisplay(deck, currentCard, keepBtn, drawBtn, resetBtn, cardView);

    // Remettre keep à false pour le tirage suivant
    keep = false;
}

// TIRAGE ALÉATOIRE : RENVOIE UNE CARTE DU DECK
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

// DÉFAUSSER OU GARDER LA CARTE PRÉCÉDENTE
function discardOrKeepPreviousCard(deck, previousCard, keep){
    if(previousCard && deck.indexOf(previousCard)!=-1 && !keep){
        deck.splice(deck.indexOf(previousCard), 1);
    }
}

// AFFICHAGE DES BOUTONS ET DE LA CARTE COURANTE - OU DU MESSAGE
function handleDisplay(deck, currentCard, keepButton, drawButton, resetButton, displayZone){
    // I - DÉBUT : LE DECK EST PLEIN MAIS PAS DE CARTE COURANTE 
    if(deck.length>0 && !currentCard){

        // L'affichage du tapis
        displayZone.innerHTML = "<h2>Votre carte s'affichera ici</h2>";

        // Les boutons
        keepButton.classList.add("hide");
        drawButton.classList.remove("hide");
        resetButton.classList.add("hide");
    }
    
    // II - IL RESTE DES CARTES DANS LE DECK ET UNE CARTE COURANTE
    if(deck.length>0 && currentCard){

        // L'affichage du tapis
        displayZone.innerHTML = "<img id='current-card' src='./"+currentCard.imgUrl+"'/>";

        // Les boutons
        keepButton.classList.remove("hide");
        drawButton.classList.remove("hide");
    }

    // III - LE DECK EST VIDE
    if(deck.length<=0){

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

// RESET
function resetGame() {
    deck = [...cards];
    currentCard = null;
    handleDisplay(deck, currentCard, keepBtn, drawBtn, resetBtn, cardView);
}
