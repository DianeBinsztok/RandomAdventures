import {displaySvgIcon} from "./display-svg.js";

/* ======= VARIABLES DE MODULE ======= */

// Élément d'interface : Les boutons,la vue de la carte courante, le tapis et la défausse
let keepBtn, resetBtn, discardBtn, baizeView, discardView, baizeList, discardList, drawBaizeBtn, drawDiscardBtn;
// La carte : là où l'affichage va changer
let card, cardTitle, cardImgContent, cardImgIllustration;

/* CHARGEMENT DES CARTES AU DÉBUT */
// Les cartes récupérées après un fetch
let cards = [];
// La pioche utilisée pendant le jeu
let deck = [];
// Les cartes réservées
let baize = [];
// Les cartes défaussées
let discardedCards=[];


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
    discardBtn = document.querySelector("#discard-btn");
    // - Garder la carte dans le deck
    keepBtn = document.querySelector("#keep-in-deck");
    // - Rejouer
    resetBtn = document.querySelector("#reset-deck");

    /* Le tapis */   
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
    card = document.querySelector("#card-view_card");
    cardTitle = document.querySelector("#card_title");
    cardImgContent = document.querySelector("#card_img_content");
    cardImgIllustration = document.querySelector("#card_img_illustration");

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

            /* IV - METTRE EN PLACE L'AFFICHAGE DE DÉBUT DE PARTIE */
            handleDisplay();
        })
    .catch(error => console.error(error));
}
// EVENTLISTENERS : ACTIVER LES BOUTONS
function setEventListeners(){

    // TIRAGE ALÉATOIRE:
    // - Au clic sur la carte courante,
    card.addEventListener("click", draw);

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
    keepBtn.addEventListener("click", ()=>{storeOrDiscard("baize")});
    // BOUTON DÉFAUSSER : DÉFAUSSER LA CARTE COURANTE
    discardBtn.addEventListener("click", ()=>{storeOrDiscard("discard")});

    // Version mobile : détecter les tapotements et swipe sur la carte
    handleTouchAndSwipes(card);

    // DRAW BAIZE : LE BOUTON POUR AFFICHER LA RÉSERVE
    drawBaizeBtn.addEventListener("click", ()=>{
        baizeView.classList.toggle("active");
    });
    // DRAW DISCARD : LE BOUTON POUR AFFICHER LA DÉFAUSSE
    drawDiscardBtn.addEventListener("click", ()=>{
        discardView.classList.toggle("active");
    });

    // BOUTON RESET : RÉAFFECTER LE TABLEAU DECK POUR RELANCER LA PARTIE
    resetBtn.addEventListener("click", resetGame);
}
// TIRAGE : RASSEMBLE LES AUTRES FONCTIONS
function draw(){
    console.log("draw");
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
// DÉFAUSSER LA CARTE COURANTE
function discardCurrentCard(){
    if(currentCard && deck.indexOf(currentCard)!=-1){
        deck.splice(deck.indexOf(currentCard), 1);
        currentCard=null;
        handleDisplay();
    }
}
// AJOUTER LA CARTE COURANTE AU TAPIS DE RÉSERVE
function storeOrDiscard(stackString){
    // placer la carte courante sur le tas "discard" ou le tas "baize"
    console.log("baize.length : ", baize.length);
    if(stackString=="baize"){
        if(baize.length<3){
            displayCurrentCardOnDesignatedStack("baize");
            baize.push(currentCard);
        }else{
            window.alert("☝ Votre réserve est pleine");
            return;
        }
    }else if(stackString=="discard"){
        displayCurrentCardOnDesignatedStack("discard");
    }
    discardCurrentCard();
}
// AFFICHER LES CARTES GARDÉES
function displayCurrentCardOnDesignatedStack(stackString){

    // Créer un nouveau node de liste
    let newCardItem = document.createElement("li");

    // Le titre de la carte
    let newCardItemTitle = document.createElement("h3");
    newCardItemTitle.classList.add("side-card_title");
    newCardItemTitle.innerText = currentCard.title;

    // L'image du contenu
    let newCardItemContentImg = document.createElement("img");
    newCardItemContentImg.setAttribute('src', currentCard.contentImgUrl);

    // L'image d'illustration
    let newCardItemIllustrationImg = document.createElement("img");
    newCardItemIllustrationImg.setAttribute('src', currentCard.illustrationImgUrl);


/*
    // Une image
    let newCardItemImg = document.createElement("img");
    // L'image contient l'image de la carte
    newCardItemImg.setAttribute('src', currentCard.contentImgUrl);
*/
    // Et tout insérer dans l'item de liste
    newCardItem.appendChild(newCardItemTitle);
    newCardItem.appendChild(newCardItemIllustrationImg);
    newCardItem.appendChild(newCardItemContentImg);


    // Et l'insérer à la liste
    if(stackString == "baize"){
        baizeList.appendChild(newCardItem);
    }else if(stackString == "discard"){
        discardList.appendChild(newCardItem);
        console.log("discardList : ", discardList);
    }
}
// AFFICHAGE DES BOUTONS ET DE LA CARTE COURANTE - OU DU MESSAGE
function handleDisplay(){
    // I - LE DECK, N'EST PAS VIDE MAIS PAS DE CARTE COURANTE 
    if(deck.length>0 && !currentCard){
        console.log("deck.length>0 && !currentCard");
        // L'affichage du tapis
        cardTitle.innerText = "Cliquez pour tirer une carte";
        cardImgContent.src = "./assets/img/back.png";
        cardImgIllustration.classList.add("hide");
        // Les boutons
        discardBtn.classList.add("hide");
        keepBtn.classList.add("hide");
        resetBtn.classList.add("hide");
    }
    
    // II - IL RESTE DES CARTES DANS LE DECK ET UNE CARTE COURANTE
    if(deck.length>0 && currentCard){

        // L'affichage du tapis
        cardTitle.innerText = currentCard.title;
        cardImgContent.src = "./"+currentCard.contentImgUrl;
        cardImgIllustration.src = "./"+currentCard.illustrationImgUrl;
        cardImgIllustration.classList.remove("hide");


        // Les boutons
        discardBtn.classList.remove("hide");
        if(baize.length<3){
            keepBtn.classList.remove("hide");
        }
    }

    // III - LE DECK EST VIDE
    if(deck.length<=0){

        // L'affichage du tapis
        cardTitle.innerText = "Votre deck est vide !";
        cardImgContent.src = "./assets/img/empty.jpg";
        cardImgIllustration.src = "./assets/img/empty.jpg";
        cardImgIllustration.classList.add("hide");


        // Les boutons
        discardBtn.classList.add("hide");
        keepBtn.classList.add("hide");
        resetBtn.classList.remove("hide");
    }

    // Remettre la valeur de keep à false pour le nouveau tour
    keepBtn.classList.remove("active");

    // Changer l'icône sur le bouton qui déroule le tapis
    changeBaizeDrawerIconToShowNumberOfStoredCards(baize, drawBaizeBtn);

    // Retirer le focus des boutons pour éviter son déclenchement au spacebar
    cardImgContent.blur();
    discardBtn.blur();
    keepBtn.blur();
}
// SWIPE ET TAPOTEMENTS
function handleTouchAndSwipes(cardView){

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
    
        /* Si le seuil de détection n'est pas dépassé : c'est un tapotement. Le tapotement est l'équivalent d'un clic : l'eventlistener est déjà présent dans setEventListeners */
        /*
        if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold ){
            console.log("tapotement");
            draw();
            return;
        }
        */
    
        // Au swipe horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Movement positif sur l'axe X = swipe à droite ➞ RÉSERVER LA CARTE
            if (deltaX > 0) {
                console.log("➞");
                storeOrDiscard("baize");
            // Movement négatif sur l'axe X = swipe à gauche ➞ DÉFAUSSER LA CARTE COURANTE
            } else {
                console.log("🠔");
                storeOrDiscard("discard");
            }
        } 
        // Au swipe vertical
        else {
            // Movement positif sur l'axe Y = swipe vers le bas ➞ TIRER UNE NOUVELLE CARTE SANS DÉFAUSSER LA PRÉCÉDENTE
            if (deltaY > 0) {
                console.log("🠗");
                draw();
            // Movement négatif sur l'axe Y = swipe vers le haut ➞ pas d'action
            } else {
                console.log("🠕");
            }
        }
    });
}

// Le bouton du tapis indique le nombre de carte réservées
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

// RESET
function resetGame(){
    deck = [...cards];
    currentCard = null;
    baizeList.innerHTML="";
    discardList.innerHTML="";
    handleDisplay();
}