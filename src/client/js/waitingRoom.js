document.addEventListener("DOMContentLoaded", () => {
  const playButton = document.getElementById("playButton");
  const waitingPopup = document.getElementById("waitingPopup");
  const playerCountSpan = document.getElementById("playerCount");
  const timerSpan = document.getElementById("timer");
  const socket = io();
  let hasClickedPlay = false; // Track whether the player has clicked "Play"
  let countdown = 5 * 60; // Initial countdown value in seconds (5 minutes)

  // Function to show the waiting pop-up
  function showPopup() {
    waitingPopup.style.display = "block";
  }

  // Function to hide the waiting pop-up
  function hidePopup() {
    waitingPopup.style.display = "none";
  }

  // Function to update the timer display
  function updateTimerDisplay(countDownSeconds) {
    if (countDownSeconds >= 0) {
      const minutes = Math.floor(countDownSeconds / 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.round(countDownSeconds % 60)
        .toString()
        .padStart(2, "0");
      timerSpan.textContent = `${minutes}:${seconds} / 05:00`;
    } else {
      // Handle the case when the timer reaches 0 or goes negative
      timerSpan.textContent = "00:00 / 05:00"; // Display "00:00 / 05:00" or a suitable message
    }
  }

  // Event listener for the "Play" button
  playButton.addEventListener("click", () => {
    if (!hasClickedPlay) {
        const username = "Username"; // Make sure this is set correctly
        // console.log("Username:", username);
        socket.emit("joinWaitingRoom", { username });

      // Show the waiting pop-up
      showPopup();

      // Disable the "Play" button after clicking
      playButton.disabled = true;
      hasClickedPlay = true;
    }
  });

  // Event listener for the disconnect button
  disconnectButton.addEventListener("click", () => {
    // Send a request to the server to disconnect from the queue (you need to implement this on the server side)
    socket.emit("disconnectFromQueue");
    // Hide the waiting popup
    hidePopup();
    // Re-enable the "Play" button
    playButton.disabled = false;
    hasClickedPlay = false;
    let timerInterval;
    clearInterval(timerInterval); // Stop the timer on disconnect
    countdown = 5 * 60; // Reset the countdown to 5 minutes
  });

  // Handle waiting room status updates from the server (e.g., player count and timer)
  socket.on('waitingRoomStatus', (data) => {
    // console.log('Received waitingRoomStatus event:', data);
    playerCountSpan.textContent = data.playerCount;

    // Use the server's countdown value
    countdown = Math.max(data.remainingTime, 0); // Ensure countdown doesn't go negative

    updateTimerDisplay(countdown / 1000); // Update the timer display

    if (data.usernames && Array.isArray(data.usernames)) {
        const userList = document.getElementById("userList");
        userList.innerHTML = "";
        data.usernames.forEach((username) => {
          const listItem = document.createElement("li");
          listItem.textContent = username;
          userList.appendChild(listItem);
        });
      } else {
        // Handle the case where data.usernames is undefined or not an array
        console.info("Received invalid usernames data:", data.usernames);
      }
  });

  // Handle the event to start the game (you can redirect users here)
  socket.on("startGame", () => {
    // Redirect users to the game session page or take appropriate action
    window.location.href = "/game";
  });
});

window.addEventListener("beforeunload", () => {
  socket.emit("disconnectFromQueue");
});

let skipCount = 0;
let stayCount = 0;
let totalPlayers = 10;
let votingDisabled = false; // Track whether voting is disabled

// Get button elements
const skipButton = document.getElementById("skipButton");
const stayButton = document.getElementById("stayButton");
const skipVotesElement = document.getElementById("skipVotes");
const stayVotesElement = document.getElementById("stayVotes");

// Add click event listeners to buttons
skipButton.addEventListener("click", () => {
    if (!votingDisabled) { // Check if voting is enabled
        skipCount++;
        disableVoting(); // Disable voting after a vote is cast
        updateDisplay();
    }
});

stayButton.addEventListener("click", () => {
    if (!votingDisabled) {
        stayCount++;
        disableVoting();
        updateDisplay();
    }
});

// Disable voting and display a message
function disableVoting() {
    votingDisabled = true;
    skipButton.disabled = true;
    stayButton.disabled = true;
    
}

// Update the display
function updateDisplay() {
    skipVotesElement.textContent = skipCount;
    stayVotesElement.textContent = stayCount;

    // Check if over 50% voted to skip
    // Check if over 50% voted to skip
if (totalPlayers === 2 && skipCount / totalPlayers >= 0.5) {
  alert("Over 50% voted to skip. Skipping...");
} else if (totalPlayers > 2 && skipCount / totalPlayers >= 0.5) {
  alert("Over 50% voted to skip. Skipping...");


        // Perform the skip action here
        socket.on("startGame", () => {
          // Redirect users to the game session page or take appropriate action
          window.location.href = "/game";
        });
    }
}

//voteskip is klaar 
//(dylan en vincent moeten nog de backend van het voteskip systeem fixen en dan is het compleet)