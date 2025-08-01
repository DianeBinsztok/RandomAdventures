/* ======= VARIABLES DE MODULE ======= */

// Élément d'interface : Les boutons,la vue de la carte courante et le tapis
let keepBtn, resetBtn, discardBtn, cardView, card, baizeView, baizeList, drawBaizeBtn;

// Une zone plus large pour tirer au swipe sur un écran tactile
let main;

/* CHARGEMENT DES CARTES AU DÉBUT */
// Les cartes récupérées après un fetch
let cards = [];
// La pioche utilisée pendant le jeu
let deck = [];

// Les cartes gardées
let baize =[];

// La carte courante : aucune carte n'est affichée au lancement du jeu
let currentCard = null;


/* ======= LANCEMENT DE LA PARTIE ======= */

window.addEventListener("load",init);


/* ======= FONCTIONS ======= */

// DÉMARRAGE : INITIALISATION DES BOUTONS, CHARGEMENT DES CARTES, MISE EN PLACE DES EVENTLISTENER
function init(){

    /* I - ÉLÉMENTS D'INTERFACES */

    /* Les boutons */
    // - La zone où sont affichés les boutons
    discardBtn = document.querySelector("#discard");
    // - Garder la carte dans le deck
    keepBtn = document.querySelector("#keep-in-deck");
    // - Rejouer
    resetBtn = document.querySelector("#reset-deck");

    /* Le tapis */   
    // - Le bouton pour déplier la réserve
    drawBaizeBtn = document.querySelector("#draw-baize");
    // - La réserve
    baizeView = document.querySelector("#baize");
    baizeList = document.querySelector("#baize-list");
    // - La carte tirées
    cardView = document.querySelector("#card-view");

    /* II - CHARGER LES CARTES */
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
            // Un deck pour chaque partie
            deck = [...cards];

            /* III - ACTIVER LES EVENTLISTENERS */
            setEventListeners();
        })
    .catch(error => console.error(error));
}
// EVENTLISTENERS : ACTIVER LES BOUTONS
function setEventListeners(){

    // TIRAGE ALÉATOIRE:
    // - Au clic sur le bouton,
    cardView.addEventListener("click", draw);

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

    // BOUTON RÉSERVER : GARDER LA CARTE COURANTE
    keepBtn.addEventListener("click", keepCurrentCardOnBaize);

    // BOUTON DÉFAUSSER : DÉFAUSSER LA CARTE COURANTE
    discardBtn.addEventListener("click", discardCurrentCard);

    // DRAW BAIZE : LE BOUTON POUR AFFICHER LA RÉSERVE
    drawBaizeBtn.addEventListener("click", ()=>{
        baizeView.classList.toggle("active");
        console.log("toggle active");
    });

    // BOUTON RESET : RÉAFFECTER LE TABLEAU DECK POUR RELANCER LA PARTIE
    resetBtn.addEventListener("click", resetGame);
}
// TIRAGE : RASSEMBLE LES AUTRES FONCTIONS
function draw(){
    console.log("draw");
    currentCard = drawNewRandomCard(deck);
    handleDisplay();
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
// DÉFAUSSER LA CARTE COURANTE
function discardCurrentCard(){
    if(currentCard && deck.indexOf(currentCard)!=-1){
        deck.splice(deck.indexOf(currentCard), 1);
        currentCard=null;
        handleDisplay();
    }
}
// AJOUTER LA CARTE COURANTE AU TAPIS DE RÉSERVE
function keepCurrentCardOnBaize(){
    console.log("keepCurrentCardOnBaize");
    displayCurrentCardOnBaize();
    discardCurrentCard();
}
// AFFICHER LES CARTES GARDÉES
function displayCurrentCardOnBaize(){

    // Créer un nouveau node de liste
    let newCardItem = document.createElement("li");

    // Un paragraphe
    let newCardItemParagraph = document.createElement("p");
    // Le paragraphe contient le titre de la carte
    newCardItemParagraph.innerText = currentCard.title;

    // Une image
    let newCardItemImg = document.createElement("img");
    // L'image contient l'image de la carte
    newCardItemImg.setAttribute('src', currentCard.imgUrl);

    // Et tout insérer dans l'item de liste
    newCardItem.appendChild(newCardItemParagraph);
    newCardItem.appendChild(newCardItemImg);


    // Et l'insérer à la liste
    baizeList.appendChild(newCardItem);
}
// AFFICHAGE DES BOUTONS ET DE LA CARTE COURANTE - OU DU MESSAGE
function handleDisplay(){
    // I - DÉBUT : LE DECK EST PLEIN MAIS PAS DE CARTE COURANTE 
    if(deck.length>0 && !currentCard){

        // L'affichage du tapis
        cardView.innerHTML = '<h2>Cliquez sur le deck tour tirer une carte</h2><img src="./assets/img/back.png" alt="Cliquez pour tirer une carte">';

        // Les boutons
        discardBtn.classList.add("hide");
        keepBtn.classList.add("hide");
        resetBtn.classList.add("hide");
    }
    
    // II - IL RESTE DES CARTES DANS LE DECK ET UNE CARTE COURANTE
    if(deck.length>0 && currentCard){

        // L'affichage du tapis
        cardView.innerHTML = "<img id='current-card' src='./"+currentCard.imgUrl+"'/>";

        // Les boutons
        discardBtn.classList.remove("hide");
        keepBtn.classList.remove("hide");
    }

    // III - LE DECK EST VIDE
    if(deck.length<=0){

        // L'affichage du tapis
        cardView.innerHTML = "<p>Votre deck est vide !</p>";

        // Les boutons
        discardBtn.classList.add("hide");
        keepBtn.classList.add("hide");
        resetBtn.classList.remove("hide");
    }

    // Remettre la valeur de keep à false pour le nouveau tour
    keepBtn.classList.remove("active");

    // Retirer le focus des boutons pour éviter son déclenchement au spacebar
    cardView.blur();
    discardBtn.blur();
    keepBtn.blur();
}
// RESET
function resetGame(){
    console.log("resetGame");
}