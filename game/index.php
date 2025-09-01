<?php

// Afficher les scripts nécessaires à une page donnée
function enqueue_scripts($scripts_array){   
    $script_string = ""; 
    foreach($scripts_array as $script){
        $script_string.= "<script type='module' src='".$script."'></script>";
    }
    return $script_string;
}
// Les scripts pour la page de jeu
$game_scripts = [
    "../../assets/scripts/game.js",
    "../../assets/scripts/templates.js",
    "../../assets/scripts/display-svg.js"
];
// Les scripts pour la page d'ajout d'une carte
$new_card_scripts = [
    "../../assets/scripts/add-new-card.js"
];

// Routage
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($uri) {
    case '/':
        $scripts = enqueue_scripts($game_scripts);
        require "templates/game.php";
        break;

    case '/new':
        $scripts = enqueue_scripts($new_card_scripts);
        require "templates/new-card.php";
        break;

    default:
        echo "La page n'existe pas";
}

