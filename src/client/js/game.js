let score = 0;
let currentQuestionIndex = 0;
let questions = []; // This will store the questions from the JSON file
var scoreImageElement = document.getElementById("scoreImage");

const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("questionDisplay");
const answerInput = document.getElementById("sumfield");
const submitButton = document.getElementById("submitButton"); // Add a button reference
const messageElement = document.getElementById("messageDisplay"); // Add a message element reference

// Load the user's selected difficulty when the page loads
fetch("/difficulty/get-difficulty")
  .then((response) => response.json())
  .then((data) => {
    userDifficulty = data.difficulty; // Assign the selected difficulty to userDifficulty
    if (userDifficulty) {
      console.log("User difficulty:", userDifficulty);
      //Load the initial difficulty set by user
      loadDifficulty(userDifficulty || "easy");
      questions.push(userDifficulty);
    }
  });

function loadDifficulty(difficulty) {
  console.log(`Loading difficulty: ${difficulty}`);
  fetch(`src/server/difficulty/${difficulty}.json`)
    .then((response) => response.json())
    .then((data) => {
      console.log("JSON data loaded:", data);
      questions = data;
      displayQuestion(); // Call this function only after questions are loaded
    })
    .catch((error) =>
      console.error(`Error loading /difficulty/${difficulty}: ${error}`)
    );
}

function displayQuestion() {
  if (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answerInput.value = ""; // Clear the previous answer
    messageElement.textContent = ""; // Clear any previous message
  } else {
    // Display a message when all questions have been answered
    questionElement.textContent = "All questions answered!";
    answerInput.style.display = "none";
    submitButton.style.display = "none";
  }
}

function checkAnswer() {
  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answerInput.value.trim().toLowerCase();

  if (userAnswer == currentQuestion.answer) {
    score++;
    messageElement.textContent = "Correct! +1";
  } else {
    score--;
    messageElement.textContent = "Incorrect! -1";
  }

  document.getElementById("score").textContent = score;
  const imageMoveAmount = score * 10; // Adjust the value as needed
  scoreImageElement.style.marginTop = imageMoveAmount + "px";
  currentQuestionIndex += 1;
  setTimeout(displayQuestion, 1000); // Display next question after 1 sec
}

// Add an event listener to handle Enter key press in the input field
document.getElementById("sumfield").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    checkAnswer(); // Call the checkAnswer function
  }
});

// Attach an event listener to the submit button
// submitButton.addEventListener("click", checkAnswer);
