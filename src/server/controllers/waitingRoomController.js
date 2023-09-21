const MAX_PLAYERS = 10;
const WAITING_ROOM_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const lobbies = {}; // Object to store multiple lobbies
let lobbyIdCounter = 0;

function createNewLobby() {
  const lobbyId = lobbyIdCounter++;
  return {
    id: lobbyId,
    players: [],
    timer: null,
    startTime: null, // Store the start time for the lobby
    remainingTime: WAITING_ROOM_TIMEOUT,
  };
}

function startWaitingRoomTimer(lobby, io) {
  if (!lobby.timer) {
    lobby.startTime = Date.now(); // Record the start time when the timer begins
    lobby.timer = setInterval(() => {
      const elapsedTime = Date.now() - lobby.startTime; // Calculate elapsed time for this lobby
      lobby.remainingTime = WAITING_ROOM_TIMEOUT - elapsedTime; // Update remaining time

      if (lobby.remainingTime <= 0) {
        clearInterval(lobby.timer);
        io.to(lobby.players.map((player) => player.id)).emit('startGame');
      } else {
        io.to(lobby.players.map((player) => player.id)).emit('waitingRoomStatus', {
          playerCount: lobby.players.length,
          remainingTime: lobby.remainingTime,
          isFull: lobby.players.length === MAX_PLAYERS,
          usernames: lobby.players.map((player) => player.username),
          serverTimestamp: lobby.startTime,
          source: 'timer', // Add a source property to differentiate this event
        });
      }
    }, 1000);
  }
}

function joinWaitingRoom(socket, io, username) {
  let lobbyToJoin = null;

  // Find an available lobby or create a new one
  for (const lobbyId in lobbies) {
    if (lobbies.hasOwnProperty(lobbyId)) {
      const lobby = lobbies[lobbyId];
      if (lobby.players.length < MAX_PLAYERS) {
        lobbyToJoin = lobby;
        break;
      }
    }
  }

  if (!lobbyToJoin) {
    lobbyToJoin = createNewLobby();
    lobbies[lobbyToJoin.id] = lobbyToJoin;
  }

  lobbyToJoin.players.push({ id: socket.id, username }); // Store the username
  socket.emit('joinedWaitingRoom', { username });

  // Start or resume the timer for the lobby
  startWaitingRoomTimer(lobbyToJoin, io);

}

function handleDisconnect(socket, io) {
  for (const lobbyId in lobbies) {
    if (lobbies.hasOwnProperty(lobbyId)) {
      const lobby = lobbies[lobbyId];
      const index = lobby.players.findIndex((player) => player.id === socket.id);
      if (index !== -1) {
        lobby.players.splice(index, 1);
        
        io.emit('waitingRoomStatus', {
          serverTimestamp: Date.now(),
          playerCount: Object.values(lobbies).reduce((count, l) => count + l.players.length, 0),
          isFull: Object.values(lobbies).some((l) => l.players.length === MAX_PLAYERS),
          lobbies: Object.values(lobbies).map((l) => ({
            playerCount: l.players.length,
            remainingTime: l.remainingTime,
            usernames: l.players.map((player) => player.username),
          })),
          source: 'disconnect', // Add a source property to differentiate this event
        });

        if (lobby.players.length === 0) {
          // Last player left the lobby, reset the timer
          clearInterval(lobby.timer);
          lobby.timer = null;
          lobby.remainingTime = WAITING_ROOM_TIMEOUT;
          lobby.startTime = null;
        }
        break;
      }
    }
  }
}

module.exports = {
  joinWaitingRoom,
  handleDisconnect,
};
