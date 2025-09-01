// Les boutons "+", pour ajouter des question dans les sous-sections "Impressions" et "Détails"
let addQuestionButtons = document.querySelectorAll(".add-question-btn");

// Au clic sur le bouton "+", un nouvel input apparaît pour ajouter une question
addQuestionButtons.forEach((button)=>{
  button.addEventListener("click", (event)=>{
    let questionsList = event.target.parentNode.querySelector(".questions_list");
    addNewQuestionInput(questionsList);
  });
});

// Créer et afficher un nouvel input de question
function addNewQuestionInput(container){

  // L'ÉLÉMENT DE LISTE
  let newQuestion = document.createElement("li");
  newQuestion.classList.add("new-question");
  
  // L'INPUT
  let questionInput = document.createElement("input");
  questionInput.type = "text";
  questionInput.classList.add("question_input");
  // Au POST, les valeurs des inputs seront dispatchées dans deux tableaux : impressions_questions [] et details_questions []
  if(container.dataset.type == "impressions"){
    questionInput.name = "impressions_questions[]";
  }else if(container.dataset.type == "details"){
    questionInput.name = "details_questions[]";
  }
  
  // LES BOUTONS
  // - Enregistrer
  let registerNewQuestionBtn = document.createElement("button");
  registerNewQuestionBtn.innerText = "Enregistrer";
  registerNewQuestionBtn.type = "button";
  registerNewQuestionBtn.classList.add("save-question-btn");
  
  // - Modifier
  let editBtn = document.createElement("button");
  editBtn.innerText = "Modifier"
  editBtn.type = "button";
  editBtn.classList.add("edit-question-btn");
  
  // - Supprimer
  let deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Supprimer";
  deleteBtn.type = "button";
  deleteBtn.classList.add("delete-question-btn");
  
  // AJOUTER TOUS LES ÉLÉMENTS À L'ITEM DE LISTE
  // L'input
  newQuestion.appendChild(questionInput);
  // Ajouter les boutons Enregistrer, Modifier et Supprimer
  newQuestion.appendChild(registerNewQuestionBtn);
  newQuestion.appendChild(editBtn);
  newQuestion.appendChild(deleteBtn);
  // Ajouter la classe 
  newQuestion.classList.add("to-be-saved");

  // AJOUTER L'ITEM DE LISTE À LA LISTE
  container.appendChild(newQuestion);
  
  
// LES EVENTLISTENERS de chaque bouton
// Enregistrer
  registerNewQuestionBtn.addEventListener("click", ()=>{
    addNewQuestion(newQuestion);
  });
  
  editBtn.addEventListener("click", ()=>{
    editNewQuestion(newQuestion);
  });
  
  deleteBtn.addEventListener("click", ()=>{
    deleteNewQuestion(newQuestion);
  });
}

// LES CALLBACKS DES EVENTLISTENERS DES BOUTONS
function addNewQuestion(targetQuestion){
  let questionInput = targetQuestion.querySelector("input");
  if(questionInput.value != ""){
    questionInput.blur();
    targetQuestion.classList.replace("to-be-saved", "saved");
  }
}

function editNewQuestion(targetQuestion){
  let questionInput = targetQuestion.querySelector("input");
  questionInput.focus();
  targetQuestion.classList.replace("saved", "to-be-saved");
}

function deleteNewQuestion(targetQuestion){
  targetQuestion.remove();
}