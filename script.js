import {displaySvgIcon} from "./display-svg.js";
import {renderCard, renderCardListItem, renderDiscardButton} from "./templates.js";

/* ======= VARIABLES DE MODULE ======= */

// Élément d'interface : Les boutons,la vue de la carte courante, le tapis et la défausse
let resetBtn, baizeView, discardView, baizeList, discardList, drawBaizeBtn, drawDiscardBtn;
// La carte : là où l'affichage va changer
let cardView;
// Les boutons : 
// - Défausser ou réserver la carte courante
let discardBtn, keepBtn;
// - Afficher la carte courante en plein écran 
let fullscreenBtn, closeFullscreenBtn;
// - Les affichage "Empty", ou "Standby")
let standbyObject = {
    "title":"Cliquez pour tirer une carte",
    "illustrationImgUrl":"./assets/img/back.png"
};
let emptyDeckObject = {
    "title":"Votre deck est vide",
    "illustrationImgUrl":"./assets/img/empty.png"
};

/* CHARGEMENT DES CARTES AU DÉBUT */
// Les cartes récupérées après un fetch
let cards = [];
// La pioche utilisée pendant le jeu
let deck = [];
// Les cartes réservées
let baize = [];


// La carte courante : aucune carte n'est affichée au lancement du jeu
let currentCard = null;

/* ======= LANCEMENT DE LA PARTIE ======= */

window.addEventListener("load",init);


/* ======= FONCTIONS ======= */

// DÉMARRAGE : INITIALISATION DES BOUTONS, CHARGEMENT DES CARTES, MISE EN PLACE DES EVENTLISTENER
function init(){
    
    /* I - ÉLÉMENTS D'INTERFACES */

    /* LES BOUTONS */
    // - La zone où sont affichés les boutons
    discardBtn = document.querySelector("#discard-btn");
    // - Garder la carte dans le deck
    keepBtn = document.querySelector("#keep-in-deck-btn");
    // - Rejouer
    resetBtn = document.querySelector("#reset-deck");
    // - Agrandir la carte courante
    fullscreenBtn = document.querySelector("#fullscreen-btn");
    // - Enlever le plein écran de la carte courante
    closeFullscreenBtn = document.querySelector("#close-fullscreen-btn");

    /* LE TAPIS */   
    // - Le bouton pour déplier la réserve
    drawBaizeBtn = document.querySelector("#draw-baize");
    // - Le bouton pour déplier la défausse
    drawDiscardBtn = document.querySelector("#draw-discard");

    // - La réserve
    baizeView = document.querySelector("#baize");
    baizeList = document.querySelector("#baize-list");
    // - La défausse
    discardView = document.querySelector("#discard");
    discardList = document.querySelector("#discard-list");
    // - Le deck
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


            /* IV - AFFICHAGE */
            handleDisplay();

        })
    .catch(error => console.error(error));
}

// EVENTLISTENERS : ACTIVER LES BOUTONS
function setEventListeners(){

    // TIRAGE ALÉATOIRE:
    // - Au clic sur la carte courante,
    cardView.addEventListener("click", draw);

    // - Au clic sur la barre d'espace
    window.addEventListener("keydown", (event)=>{
        // Vérifier que c'est bien la barre d'espace qui est pressée
        if (event.key == " " || event.code == "Space") {
            // Éviter le scroll
            event.preventDefault();
            // Tirer une nouvelle carte
            console.log("Tirer une nouvelle carte");
        }
    });

    // ÉVÉNEMENTS TACTILES
    handleTouchAndSwipes(cardView);

    // BOUTON RÉSERVER : GARDER LA CARTE COURANTE
    keepBtn.addEventListener("click", ()=>{ storeOrDiscard("baize");});
    // BOUTON DÉFAUSSER : DÉFAUSSER LA CARTE COURANTE
    discardBtn.addEventListener("click", ()=>{storeOrDiscard("discard")});

    // Version mobile : détecter les tapotements et swipe sur la carte
    console.log("handleTouchAndSwipes");

    // DRAW BAIZE : LE BOUTON POUR AFFICHER LA RÉSERVE
    drawBaizeBtn.addEventListener("click", ()=>{
        baizeView.classList.toggle("active");
    });
    // DRAW DISCARD : LE BOUTON POUR AFFICHER LA DÉFAUSSE
    drawDiscardBtn.addEventListener("click", ()=>{
        discardView.classList.toggle("active");
    });

    // BOUTON FULLSCREEN : AFFICHER UNE IMAGE EN PLEIN ÉCRAN POUR MIEUX LIRE LE CONTENU
    fullscreenBtn.addEventListener("click",()=>toggleCurrentCardFullscreen("on"));
    // BOUTON POUR SORTIR DU PLEIN ÉCRAN
    closeFullscreenBtn.addEventListener("click",()=>toggleCurrentCardFullscreen("off"));

    // BOUTON RESET : RÉAFFECTER LE TABLEAU DECK POUR RELANCER LA PARTIE
    resetBtn.addEventListener("click", resetGame);
}
// SWIPE ET TAPOTEMENTS
function handleTouchAndSwipes(card){

    console.log("card => ", card);
    // Coordonnées de départ
    let startX = 0;
    let startY = 0;

    // Le seuil de mouvement du doigt détectable : 50px
    const swipeThreshold = 50;
    
    // Au début du toucher
    card.addEventListener("touchstart", (event) => {
        // Enregistrer les coordonées touchées, sur les deux axes
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });
    // À la fin du contact
    card.addEventListener("touchend", (event) => {

        // Enregistrer la différence entre le contact de départ et le contact de fin, sur les deux axes
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
    
        const deltaX = endX - startX;
        const deltaY = endY - startY;
    
        // Au swipe horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Movement positif sur l'axe X = swipe à droite ➞ RÉSERVER LA CARTE
            if (deltaX > 0) {
                if(currentCard){
                    storeOrDiscard("baize");
                }
            // Movement négatif sur l'axe X = swipe à gauche ➞ DÉFAUSSER LA CARTE COURANTE
            } else {
                if(currentCard){
                    storeOrDiscard("discard");
                }
            }
        } 
        // Au swipe vertical
        else {
            // Movement positif sur l'axe Y = swipe vers le bas ➞ Tirer une nouvelle carte (s'il n'y a pas de carte courante)
            if (deltaY > 0) {
                draw();
            }
        }
    });
}
// TIRAGE : RASSEMBLE LES AUTRES FONCTIONS
function draw(){
    if(!currentCard){
        currentCard = drawNewRandomCard(deck);
        handleDisplay();
    }
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
// RETIRER LA CARTE COURANTE du deck
function removeCurrentCardFromDeck(){
    if(currentCard && deck.indexOf(currentCard)!=-1){
        deck.splice(deck.indexOf(currentCard), 1);
        currentCard=null;
        handleDisplay();
    }
}
// AFFICHAGE DES CARTES ET BOUTONS SELON LES CAS
function handleDisplay(){

    // I - LE DECK, N'EST PAS VIDE MAIS PAS DE CARTE COURANTE 
    if(deck.length>0 && !currentCard){

        // L'affichage du tapis
        let card = renderCard(standbyObject, true);
        cardView.innerHTML = card;
        // Pas de carte courante = pas de plein écran
        cardView.classList.remove("fullscreen");
        closeFullscreenBtn.classList.add("hide");
        
        // Les boutons
        discardBtn.classList.add("hide");
        keepBtn.classList.add("hide");
        resetBtn.classList.add("hide");
        fullscreenBtn.classList.add("hide");
    }
    
    // II - IL RESTE DES CARTES DANS LE DECK ET UNE CARTE COURANTE
    if(deck.length>0 && currentCard){

        // L'affichage du tapis
        let card = renderCard(currentCard);
        cardView.innerHTML = card;

        // Les boutons
        discardBtn.classList.remove("hide");
        fullscreenBtn.classList.remove("hide");
        if(baize.length<3){
            keepBtn.classList.remove("hide");
        }
    }

    // III - LE DECK EST VIDE
    if(deck.length<=0){

        // L'affichage du tapis
        let card = renderCard(emptyDeckObject, true);
        cardView.innerHTML = card;
        // Deck vide = pas de plein écran
        cardView.classList.remove("fullscreen");
        closeFullscreenBtn.classList.add("hide");

        // Les boutons
        discardBtn.classList.add("hide");
        keepBtn.classList.add("hide");
        fullscreenBtn.classList.add("hide");
        resetBtn.classList.remove("hide");
    }

    // Remettre la valeur de keep à false pour le nouveau tour
    keepBtn.classList.remove("active");

    // Changer l'icône sur le bouton qui déroule le tapis
    //changeBaizeDrawerIconToShowNumberOfStoredCards(baize, drawBaizeBtn);

    // Retirer le focus des boutons pour éviter son déclenchement au spacebar
    cardView.blur();
    discardBtn.blur();
    keepBtn.blur();
}
// RÉSERVER OU DÉFAUSSER LA CARTE COURANTE
function storeOrDiscard(stackString){
    // Réserver
    // Pour la placer dans la réserve, s'assurer que celle-ci n'est pas pleine (3 cartes maximum)
    if(stackString=="baize"){
        if(baize.length<3){
            displayCardOnDesignatedStack(currentCard, "baize");
            // L'enregistrer dans le tableau pour le comptage
            baize.push(currentCard);
            // Changer l'icône sur le bouton de la réserve pour montrer le nombre de cartes réservées
            changeBaizeDrawerIconToShowNumberOfStoredCards(baize, drawBaizeBtn)
        }else{
            window.alert("☝ Votre réserve est pleine");
            return;
        }
    // Ou défausser
    }else if(stackString=="discard"){
        displayCardOnDesignatedStack(currentCard, "discard");
    }
    // Dans les deux cas : la carte courante est retirée du deck
    removeCurrentCardFromDeck();
}
// AFFICHER LES CARTES GARDÉES
function displayCardOnDesignatedStack(card, stackString){

    // Créer un nouveau node de liste
    let newCardIListItem;
    
    // Et l'insérer à la liste correspondante : 
    // La réserve
    if(stackString == "baize"){
        newCardIListItem = renderCardListItem(card, true);
        // Pour les cartes réservées, afficher aussi un bouton pour défausser
        let discardButton = renderDiscardButton(card.id);
        // Activer le bouton
        discardButton.addEventListener("click", (event)=>{discardAStoredCard(event.target)});
        newCardIListItem.appendChild(discardButton);

        // Et ajouter le tout à la liste
        baizeList.appendChild(newCardIListItem);
    }
    // Ou la défausser
    else if(stackString == "discard"){
        newCardIListItem= renderCardListItem(card, false)
        discardList.appendChild(newCardIListItem);
    }
    handleDisplay();
}
// METTRE UNE CARTE EN PLEIN ÉCRAN
function toggleCurrentCardFullscreen(onOrOffString){
    if(onOrOffString === "on"){
        console.log("card.classList.add('fullscreen')");
        cardView.classList.add('fullscreen')
        closeFullscreenBtn.classList.remove("hide");
    }else if(onOrOffString === "off"){
        console.log("card.classList.remove('fullscreen')");
        cardView.classList.remove('fullscreen')
        closeFullscreenBtn.classList.add("hide");
    }
}
// LE BOUTON DE LA RÉSERVE INDIQUE LE NOMBRE DE CARTES RÉSERVÉES
function changeBaizeDrawerIconToShowNumberOfStoredCards(baizeArray, baizeDrawerBtn){
    switch(baizeArray.length){
        case 0:
            baizeDrawerBtn.innerHTML = displaySvgIcon("emptyBaize")
            break;
        case 1:
            baizeDrawerBtn.innerHTML = displaySvgIcon("baizeOfOne")
            break;
        case 2:
            baizeDrawerBtn.innerHTML = displaySvgIcon("baizeOfTwo")

            break;
        case 3:
            baizeDrawerBtn.innerHTML = displaySvgIcon("fullBaize")
            break;
    }
}
// ACTIVER LE BOUTON "DÉFAUSSER" DES CARTES RÉSERVÉES
function discardAStoredCard(discardBtn){
    // Identifier la carte à défausser par son id (mentionnée dans l'id du bouton)
    let cardIndex = parseInt(discardBtn.id, 10);
    let cardToRemoveFromBaizeArray =  baize.find(card=>card.id === cardIndex);

    // La supprimer sur tableau de la réserve
    baize.splice(baize.indexOf(cardToRemoveFromBaizeArray), 1);
  
    // Supprimer l'item de liste dans l'affichage de la réserve
    baizeList.removeChild(discardBtn.parentNode);
    // Changer l'icône pour indiquer le nouveau nombre de carte réservées
    changeBaizeDrawerIconToShowNumberOfStoredCards(baize, drawBaizeBtn);
    // Afficher la carte dans la défausse
    displayCardOnDesignatedStack(cardToRemoveFromBaizeArray, "discard");
}
// RESET
function resetGame(){
    deck = [...cards];
    currentCard = null;
    baizeList.innerHTML="";
    discardList.innerHTML="";
    console.log("resetGame");
}

export {discardAStoredCard};