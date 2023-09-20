const express = require('express');
const router = express.Router();
const { joinWaitingRoom, handleDisconnect } = require('./controllers/waitingRoomController.js');

// Define waiting room routes
router.post('/join', (req, res) => {
  // Handle user joining the waiting room
  const socket = req.app.get('socketIO'); // Get the socket.io instance from your app
  joinWaitingRoom(socket, io);
  res.status(200).send('Joined waiting room');
});

// Handle user disconnections
router.post('/disconnect', (req, res) => {
  // Handle user disconnecting from the waiting room
  const socket = req.app.get('socketIO'); // Get the socket.io instance from your app
  handleDisconnect(socket);
  res.status(200).send('Disconnected from waiting room');
});

module.exports = router;
