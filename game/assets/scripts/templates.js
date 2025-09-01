// LA CARTE
function renderCard(cardObject, emptyOrBack){

    // Les sous-sections : 
    // Impressions
    let impressionsSection="";
    // Détails
    let detailsSection="";
    let illustration="";

  if(!emptyOrBack){
    // Les sous-sections : 
    // Impressions
    impressionsSection = renderSubSection(cardObject.impressions, "Impressions");
    // Détails
    detailsSection = renderSubSection(cardObject.details, "Détails");
    illustration = `./assets/img/cards/${cardObject.illustration}`;
  }else{
    illustration = `./assets/img/${cardObject.illustration}`;
  }
    return `
      <section class="card">

        <div class="card_heading">
            <h2 class="card_heading_title">${cardObject.title}</h2>
        </div>

        <img class="card_illustration" src="${illustration}" alt=""/>

        ${impressionsSection}

        ${detailsSection}

      </section>
    `;
}
// LES SOUS-SECTIONS IMPRESSIONS ET DÉTAILS
function renderSubSection(cardObjectSectionToDisplay, titleString){

  let questionsList = renderQuestionsInAList(cardObjectSectionToDisplay.questions);

  return `        
        <section class="card_subsection">
            <h3 class="card_subsection_title">${titleString}</h3>
            <div class="card_subsection_text">${cardObjectSectionToDisplay.text}</div>
            <ul class="card_subsection_questions">${questionsList}</ul>
        </section>`;
}
// LES LISTES DE QUESTIONS DANS LES ENCADRÉES IMPRESSIONS ET DÉTAIL
function renderQuestionsInAList(questions){
  let resultString = "";
  questions.forEach((question)=>{
    resultString = resultString + `<li>${question}</li>`;
  });
  return resultString;
}

// LE BOUTON "DÉFAUSSER" DES CARTES RÉSERVÉES
function renderDiscardButton(associatedCardId){
  let discardStoredCardBtn = document.createElement("button");
  discardStoredCardBtn.classList.add("discard-stored-card_btn");
  discardStoredCardBtn.id = associatedCardId;
  discardStoredCardBtn.innerText = "🠔 Défausser";
  
  //return '<button class="discard-stored-card_btn">🠔 Défausser</button>';
  return discardStoredCardBtn;
}

// LA CARTE, EN TANT QU'ITEM DE LISTE, DANS LA DÉFAUSSE OU LA RÉSERVE
function renderCardListItem(cardObject, discardable){

  // Créer un élément de liste
  let newListItem = document.createElement("li");

  // Générer la carte et l'ajouter comme contenu de l'élément de liste
  newListItem.innerHTML = renderCard(cardObject);

  return newListItem;
}

export {renderCard, renderDiscardButton, renderCardListItem};