// Load questions from a JSON file based on the selected difficulty and the number of players
function loadQuestions(difficulty) {
  try {
    const rawQuestions = fs.readFileSync(`../../difficulty/${difficulty}.json`);
    const allQuestions = JSON.parse(rawQuestions);
    
    // Limit the number of questions to 20
    const limitedQuestions = allQuestions.slice(0, 20);

    return limitedQuestions;
  } catch (error) {
    console.error("Error loading questions:", error);
    return [];
  }
}

// Set up initial game state when the game starts
function startGame(players, gameState) {
  gameState.players = players; // Assign the array of players to gameState
  gameState.questions = initializeQuestionsForPlayers(players, gameState);
  gameState.currentPlayerIndex = 0; // Start with the first player

  // Determine the maximum number of questions for the game
  const maxQuestions = gameState.questions.length;

  // Trigger the pop-up or notification when all players are done
  if (gameState.currentPlayerIndex === maxQuestions) {
    // All players are done; implement your pop-up/notification logic here
    // You can emit an event to the clients to show a pop-up.
  }
}

// Function to handle a player's answer submission
function submitAnswer(playerId, answer) {
  return new Promise((resolve, reject) => {
    // Get the player's current question from your game state
    const player = gameState.players.find((p) => p.id === playerId);

    if (gameState.currentPlayerIndex < gameState.questions.length) {
      const currentQuestion = gameState.questions[gameState.currentPlayerIndex];
      // Implement your answer validation logic here
      const correctAnswer = currentQuestion.answer.toLowerCase();
      const playerAnswer = answer.toLowerCase();

      if (playerAnswer === correctAnswer) {
        // Update the player's score if the answer is correct
        player.score += 1;
        gameState.currentPlayerIndex++; // Move to the next question
        resolve({ message: 'Correct answer!', isCorrect: true });
      } else {
        resolve({ message: 'Incorrect answer. Try again.', isCorrect: false });
      }
    } else {
      // All players are done; provide an appropriate message
      resolve({ message: 'All players are done. The game has ended.', isCorrect: false });
    }
  });
}

module.exports = {
  loadQuestions,
  startGame,
  submitAnswer,
  // Add other game-related functions as needed
};
