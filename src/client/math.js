var score = 0;
var currentQuestionIndex = 0; // Keeps track of the current question index
var questions = []; // Array to store the questions from the JSON file

// Function to fetch questions from the JSON file
function fetchQuestions() {
  fetch('src/questions.json')
    .then(response => response.json())
    .then(data => {
      questions = data;
      displayNextQuestion();
    })
    .catch(error => {
      console.error('Error fetching questions:', error);
    });
}

// Function to display the next question
function displayNextQuestion() {
  var questionDisplay = document.getElementById("questionDisplay");
  if (currentQuestionIndex < questions.length) {
    var currentQuestion = questions[currentQuestionIndex];
    questionDisplay.textContent = currentQuestion.question;
    document.getElementById("sumfield").value = ""; // Clear the input field
  } else {
    // No more questions
    questionDisplay.textContent = "Quiz completed!";
  }
}

// Function to display messages and update the score
function displayMessage(message) {
    var messageDisplay = document.getElementById("messageDisplay");
    messageDisplay.textContent = message;
  }
  
  function checkAnswer() {
    var answer = document.getElementById("sumfield").value;
  
    if (currentQuestionIndex < questions.length) {
      var currentQuestion = questions[currentQuestionIndex];
  
      // Check if the entered answer is correct
      if (parseInt(answer) === currentQuestion.answer) {
        score++;
        document.getElementById("score").textContent = "Score: " + score;
        currentQuestionIndex++;
        displayNextQuestion();
        displayMessage("Correct! Your score is now " + score);
      } else {
        displayMessage("Incorrect. Try again!");
      }
    }
  }

// Add an event listener to handle Enter key press in the input field
document.getElementById("sumfield").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    checkAnswer(); // Call the checkAnswer function
  }
});

// Call the fetchQuestions function to load questions when the page loads
fetchQuestions();
