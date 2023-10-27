const express = require("express");
const router = express.Router();
const gameController = require('../controllers/gameController');

// Define a route to load questions
router.get('/load-questions/:difficulty', (req, res) => {
  const { difficulty } = req.params;
  const questions = gameController.loadQuestions(difficulty);
  res.json(questions);
});

// Define a route to start the game
router.post('/start-game', (req, res) => {
  const { players } = req.body;
  const gameState = gameController.initializeGameState();
  gameController.startGame(players, gameState);
  res.json({ message: "Game started" });
});

// Handle player answer submissions
router.post('/submit-answer', (req, res) => {
  const { answer, playerId } = req.body;

  // Use the game controller to process the answer
  gameController.submitAnswer(playerId, answer)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;
