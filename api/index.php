<?php

// Charger la librairie : 
require __DIR__ . '/../vendor/autoload.php';

// Le chemin vers le fichier .env
var_dump(file_exists(__DIR__ . '/../.env'));
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');

// Charger les valeurs
$dotenv->load();

// Utiliser les variable d'environnement pour accéder à la BDD
$dsn = $_ENV['DB'];
$username = $_ENV['DBUSER'];
$password = $_ENV['DBPASSWORD'];

// Le corps des requêtes sera en json
header("Content-Type: application/json; charset=utf-8");


$database = new PDO($dsn, $username, $password);
$database->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($database) {
    try {
        $statement = $database->query(
            "SELECT 
            cards.id,
            cards.title, 
            cards.illustration,
            card_sections.type AS section_type,
            card_sections.text AS section_text,
            questions.question AS question
            FROM cards 
            INNER JOIN card_sections ON card_sections.card_id = cards.id
            LEFT JOIN questions ON questions.card_section_id = card_sections.id;"
        );

        $result = $statement->fetchAll(PDO::FETCH_ASSOC);

        $cards = [];
        foreach ($result as $row) {
            $id = $row['id']; // attention : ta requête SELECT renvoie "cards.id", pas "card_id" !

            if (!isset($cards[$id])) {
                $cards[$id] = [
                    "id" => $id,
                    "title" => $row['title'],
                    "illustration" => $row['illustration'],
                    "impressions" => ["text" => "", "questions" => []],
                    "details" => ["text" => "", "questions" => []],
                ];
            }

            $sectionType = $row['section_type'];
            if ($sectionType && in_array($sectionType, ['impressions', 'details'])) {
                if (empty($cards[$id][$sectionType]["text"]) && !empty($row['section_text'])) {
                    $cards[$id][$sectionType]["text"] = $row['section_text'];
                }
                if (!empty($row['question'])) {
                    $cards[$id][$sectionType]["questions"][] = $row['question'];
                }
            }
        }


        // Transformer en tableau JSON indexé
        echo json_encode(array_values($cards), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);


    } catch (PDOException $e) {
        echo "Erreur SQL : " . $e->getMessage();
    }
}


