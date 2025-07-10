// DOM ELEMENTS
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

// GAME STATE VARIABLES
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

// Decode HTML entities (fixes issues like &#039;)
function decodeHTMLEntities(text) {
  const txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}

// TOPIC FROM URL PARAMETER
const params = new URLSearchParams(window.location.search);
const topicKey = params.get('topic') || '1'; // Default to key 1 if missing

// PREDEFINED API URL MAP BASED ON TOPIC KEYS
const apiMap = {
  '1': 'https://opentdb.com/api.php?amount=20&category=18&difficulty=medium&type=multiple',   // Computer
  '2': 'https://opentdb.com/api.php?amount=20&category=12&difficulty=medium&type=multiple',   // Music
  '3': 'https://opentdb.com/api.php?amount=20&category=19&difficulty=medium&type=multiple',   // Math
  '4': 'https://opentdb.com/api.php?amount=20&category=20&difficulty=medium&type=multiple',   // Mythology
  '5': 'https://opentdb.com/api.php?amount=20&category=21&difficulty=medium&type=multiple'    // Sports
};

// SELECT API URL
const apiURL = apiMap[topicKey] || apiMap['1'];

// FETCH QUESTIONS FROM API
fetch(apiURL)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: decodeHTMLEntities(loadedQuestion.question),
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion['choice' + (index + 1)] = decodeHTMLEntities(choice);
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

// START GAME
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
};

// LOAD A NEW QUESTION
getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('/end.html'); // Go to end page
  }

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

  // Update progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

// HANDLE USER CHOICE
choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

// INCREMENT SCORE
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};