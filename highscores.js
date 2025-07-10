// DOM ELEMENT
const highScoresList = document.getElementById("highScoresList");

// RETRIEVE HIGH SCORES FROM LOCAL STORAGE OR FALLBACK TO EMPTY ARRAY
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// RENDER HIGH SCORES TO THE LIST
highScoresList.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");
