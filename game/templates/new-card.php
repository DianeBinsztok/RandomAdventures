<?php require ("partials/header.php"); ?>

        <h2>Ajoutez une nouvelle carte</h2>
        <form action="../api/process-new-card.php" method="post" id="new-card">

            <div id="card_heading">
                <label for="title">Titre *</label>
                <input type="textarea" name="title" id="card_title" required />
            </div>
            <div class="card_subsection">
                <h3 class="card_subsection_title">Impressions</h3>
                <div>
                    <label for="impressions_text">Résumez l'impression que doit avoir l'événement sur les joueurs</label>
                    <textarea name="impressions_text" id="impressions_text" rows="5" cols="33" required>
                    </textarea>
                </div>
                <div>
                <label for="questions">Ajoutez des questions</label>
                <ul class="questions_list" id="questions-list_impressions" data-type="impressions">
                </ul>
                <button class="add-question-btn" type="button" id="target-questions-list_impressions">+</button>
                </div>
            </div>

            <div class="card_subsection">
                <h3 class="card_subsection_title">Détails</h3>
                <div class="card_subsection_text">
                    <label for="details_text">Ajoutez du détail et des éléments de narration</label>
                    <textarea name="details_text" id="details_text" rows="5" cols="33" required>
                    </textarea>
                </div>
                <div class="card_subsection_questions">
                <label for="questions">Ajoutez des questions</label>
                <ul class="questions_list" id="questions-list_detail" data-type="details">
                </ul>
                    <button class="add-question-btn" type="button" id="target-questions-list_detail">+</button>
                </div>
            </div>
            <div>
                <input class="save-card-btn" type="submit" value="Enregistrer" />
            </div>
        </form>
<?php require ("partials/footer.php"); ?>
