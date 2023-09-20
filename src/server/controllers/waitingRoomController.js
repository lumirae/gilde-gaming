// waitingRoom.js (server-side)

const MAX_PLAYERS = 10;
const WAITING_ROOM_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

const waitingRoom = {
  players: [],
  timer: null,
  remainingTime: WAITING_ROOM_TIMEOUT, // Add a remainingTime property
};

function startWaitingRoomTimer(io) {
  if (waitingRoom.timer === null) {
    waitingRoom.timer = setInterval(() => {
      waitingRoom.remainingTime -= 1000; // Subtract 1 second from remaining time
      if (waitingRoom.remainingTime <= 0) {
        clearInterval(waitingRoom.timer);
        io.emit('startGame'); // Notify all clients to start the game
      } else {
        io.emit('waitingRoomStatus', {
          playerCount: waitingRoom.players.length,
          remainingTime: waitingRoom.remainingTime,
          isFull: waitingRoom.players.length === MAX_PLAYERS,
        });
      }
    }, 1000); // Update the timer every 1 second
  }
}

function joinWaitingRoom(socket, io) {
  if (waitingRoom.players.length < MAX_PLAYERS) {
    waitingRoom.players.push(socket.id);
    socket.emit('joinedWaitingRoom');
    
    // Check if the timer is already running before starting it
    if (waitingRoom.timer === null) {
      startWaitingRoomTimer(io); // Start the timer only if it's not running
    }

    io.emit('waitingRoomStatus', {
      playerCount: waitingRoom.players.length,
      remainingTime: waitingRoom.remainingTime,
      isFull: waitingRoom.players.length === MAX_PLAYERS,
    });
  } else {
    socket.emit('roomFull');
  }
}

function handleDisconnect(socket, io) {
  const index = waitingRoom.players.indexOf(socket.id);
  if (index !== -1) {
    waitingRoom.players.splice(index, 1);
    if (waitingRoom.players.length === 0) {
      clearInterval(waitingRoom.timer);
      waitingRoom.timer = null;
      waitingRoom.remainingTime = WAITING_ROOM_TIMEOUT; // Reset the timer
    }
    io.emit('waitingRoomStatus', {
      playerCount: waitingRoom.players.length,
      remainingTime: waitingRoom.remainingTime,
      isFull: waitingRoom.players.length === MAX_PLAYERS,
    });
  }
}

module.exports = {
  joinWaitingRoom,
  handleDisconnect,
};
