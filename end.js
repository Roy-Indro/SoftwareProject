// DOM Elements
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');

// Retrieve most recent score from local storage
const mostRecentScore = localStorage.getItem('mostRecentScore');

// Load existing high scores or initialize an empty array
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Limit the number of saved high scores
const MAX_HIGH_SCORES = 5;

// Display the final score on the page
finalScore.innerText = mostRecentScore;

// Enable the save button only if username input is not empty
username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
});

// Save high score to local storage and redirect to home
saveHighScore = (e) => {
  e.preventDefault();

  const score = {
    score: mostRecentScore,
    name: username.value,
  };

  highScores.push(score);

  // Sort scores in descending order
  highScores.sort((a, b) => b.score - a.score);

  // Keep only the top 5 scores
  highScores.splice(MAX_HIGH_SCORES);

  // Store updated scores in local storage
  localStorage.setItem('highScores', JSON.stringify(highScores));

  // Redirect to home page
  window.location.assign('/');
};
