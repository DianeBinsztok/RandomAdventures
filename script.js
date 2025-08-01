/* ======= VARIABLES DE MODULE ======= */

// Élément d'interface : Les boutons,la vue de la carte courante et le tapis
let keepBtn, resetBtn, cardView, card, baizeView, drawBaizeBtn;

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

// Garder ou non la carte courante : inutilisé au début de la partie
//let keep = false;


/* ======= LANCEMENT DE LA PARTIE ======= */

window.addEventListener("load",init);


/* ======= FONCTIONS ======= */

function init(){

    /* I - VALEURS DE DÉPART */

    /* Les boutons */
    // - Garder la carte dans le deck
    keepBtn = document.querySelector("#keep-in-deck");
    // - Rejouer
    resetBtn = document.querySelector("#reset-deck");

    /* LE TAPIS */   
    /* Le bouton pour déplier la réserve*/
    drawBaizeBtn = document.querySelector("#draw-baize");
    /* La réserve*/
    baizeView = document.querySelector("#baize");
    /* La carte tirées */
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

    // BOUTON KEEP - VARIABLE KEEP : GARDER LA CARTE COURANTE OU NON
    keepBtn.addEventListener("click", ()=>{
        keepBtn.classList.toggle("active");
        //keep = keepBtn.classList.contains("active");
        draw();
    })

    // DRAW BAIZE : LE BOUTON POUR AFFICHER LA RÉSERVE
    drawBaizeBtn.addEventListener("click", ()=>{
        baizeView.classList.toggle("active");
        console.log("toggle active");
    });

    // BOUTON RESET : RÉAFFECTER LE TABLEAU DECK POUR RELANCER LA PARTIE
    resetBtn.addEventListener("click", resetGame);
}

function draw(){
    console.log("draw");
}

function resetGame(){
    console.log("resetGame");
}