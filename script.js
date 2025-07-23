window.addEventListener("load",function(){

    // Le bouton
    const drawBtn = document.querySelector("#draw-button");
    // L'affichage de la carte
    const cardView = document.querySelector("#card-view");
    // Si aucune carte n'est tirée, afficher un tapis ou autre ...
    cardView.innerHTML="<h2>La carte s'affichera ici</h2>";

    // Le bouton pour garder la carte dans le deck
    const keepBtn = document.querySelector("#keep-in-deck");
    let keep = false;

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


            // Gérer la visibilité des boutons avant le premier tirage
            handleButtonsDisplay(deck, currentCard, keepBtn, drawBtn);

            // VARIABLE KEEP : GARDER LA CARTE COURANTE OU NON
            keepBtn.addEventListener("click", ()=>{
                keepBtn.classList.toggle("active");
                console.log('keepBtn :', keepBtn);
                keep = keepBtn.classList.contains("active");
                console.log('keep :', keep);
            })

            // TIRAGE ALÉATOIRE:

            // Au clic sur le bouton,
            drawBtn.addEventListener("click", ()=>{
                // Tirer une nouvelle carte
                draw(deck);
            });

            // Au clic sur la barre d'espace
            addEventListener("keydown", (event)=>{
                // Éviter le scroll
                event.preventDefault();
                // Vérifier que c'est bien la barre d'espace qui est pressée
                if (event.key == " " || event.code == "Space") {
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
            // À garder dans le scope des variables à modifier : currentCard, displayArea, keep, keepBtn, drawBtn
            function draw(deck){

                if(deck.length>0){                    
                    // Défausser la carte précédente s'il y en a une et que le mode 'keep' n'est pas sélectionné
                    discardOrKeepPreviousCard(deck, currentCard, keep);

                    console.log("deck.length :", deck.length);

                    // Tirer une nouvelle carte
                    currentCard = drawNewRandomCard(deck);

                    // Afficher la nouvelle carte
                    cardView.innerHTML = displayRandomCardOrMessage(currentCard);

                    // Affichage des boutons
                    handleButtonsDisplay(deck, currentCard, keepBtn, drawBtn);
                }else{
                    // Afficher le message : le deck est vide
                    cardView.innerHTML = displayRandomCardOrMessage();
                                        
                    // Affichage des boutons
                    handleButtonsDisplay(deck, currentCard, keepBtn, drawBtn);
                }
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
function displayRandomCardOrMessage(cardToDisplay){

    // Afficher la carte, s'il en a une
    if(cardToDisplay){
        return "<img id='current-card' src='./"+cardToDisplay.imgUrl+"'/>";
                
    // Sinon, afficher un message
    }else{
        return "<p>Votre deck est vide !</p>";
    }
}

function discardOrKeepPreviousCard(deck, previousCard, keep){
    if(previousCard && deck.indexOf(previousCard)!=-1 && !keep){
        deck.splice(deck.indexOf(previousCard), 1);
        console.log("deck après défausse :", deck);
    }
}


function handleButtonsDisplay(deck, currentCard, keepButton, drawButton){
    // Début : Il reste des cartes dans le deck mais pas de carte active -> 
    if(deck.length>0 && !currentCard){
        console.log("deck.length>0 && !currentCard");
        keepButton.classList.add("hide");
        drawButton.classList.remove("hide");
    }
    
    // Il reste des cartes dans le deck et une carte est affichée
    if(deck.length>0 && currentCard){
        console.log("deck.length>0 && currentCard");
        keepButton.classList.remove("hide");
        drawButton.classList.remove("hide");
    }

    // Le deck est vide
    if(deck.length<=0){
        console.log("deck.length <=0");
        keepButton.classList.add("hide");
        drawButton.classList.add("hide");
    }

    // Remettre la valeur de keep à false pour le nouveau tour
    keepButton.classList.remove("active");

    // Retirer le focus des boutons pour éviter son déclenchement au spacebar
    drawButton.blur();
    keepButton.blur();
}