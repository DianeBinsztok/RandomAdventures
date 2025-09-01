<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($uri) {
    case '/':
        require "templates/game.php";
        break;

    case '/new':
        require "templates/new-card.php";
        break;

    default:
        echo "La page n'existe pas";
}