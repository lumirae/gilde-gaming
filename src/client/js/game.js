let score = 0;
let currentQuestionIndex = 0;
const questions = []; // This will store the questions from the JSON file

const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submitButton'); // Add a button reference
const messageElement = document.getElementById('message'); // Add a message element reference

// Load questions from the JSON file
fetch('../../src/questions.json')
  .then((response) => response.json())
  .then((data) => {
    questions.push(...data);
    displayQuestion(); // Call this function only after questions are loaded
  })
  .catch((error) => console.error('Error loading questions:', error));

function displayQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answerInput.value = ''; // Clear the previous answer
    messageElement.textContent = ''; // Clear any previous message
  } else {
    // Display a message when all questions have been answered
    questionElement.textContent = 'All questions answered!';
    answerInput.style.display = 'none';
    submitButton.style.display = 'none';
  }
}

function checkAnswer() {
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answerInput.value.trim().toLowerCase();

  if (userAnswer === currentQuestion.answer.toLowerCase()) {
    score += 1;
    messageElement.textContent = 'Correct! +1';
  } else {
    score -= 1;
    messageElement.textContent = 'Incorrect! -1';
  }

  document.getElementById('score').textContent = score;
  currentQuestionIndex += 1;
  setTimeout(displayQuestion, 1000); // Delay displaying the next question for 1 second
}

// Attach an event listener to the submit button
submitButton.addEventListener('click', checkAnswer);
