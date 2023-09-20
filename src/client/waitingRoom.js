// Function to show the waiting pop-up
function showPopup() {
    waitingPopup.style.display = "block";
}

// Function to hide the waiting pop-up
function hidePopup() {
    waitingPopup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("playButton");
    const waitingPopup = document.getElementById("waitingPopup");
    const playerCountSpan = document.getElementById("playerCount");
    const timerSpan = document.getElementById("timer");

    let countdown = 5 * 60; // Initial countdown value in seconds (5 minutes)
    let hasClickedPlay = false; // Track whether the player has clicked "Play"

    // Function to update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(countdown / 60).toString().padStart(2, "0");
        const seconds = (countdown % 60).toString().padStart(2, "0");
        timerSpan.textContent = `${minutes}:${seconds}`;
    }

    // Event listener for the "Play" button
    playButton.addEventListener("click", () => {
        if (!hasClickedPlay) {
            // Send a request to the server to join the waiting queue
            socket.emit("joinWaitingRoom");

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
    });

    // Handle waiting room status updates from the server (e.g., player count and timer)
    socket.on("waitingRoomStatus", (data) => {
        playerCountSpan.textContent = data.playerCount;
        countdown = Math.floor(data.remainingTime / 1000); // Convert milliseconds to seconds
        updateTimerDisplay(); // Update the timer display
    });

    // Handle the event to start the game (you can redirect users here)
    socket.on("startGame", () => {
        // Redirect users to the game session page or take appropriate action
        window.location.href = '/game';
    });
});

window.addEventListener("beforeunload", () => {
    // Emit a disconnect event to the server
    socket.emit("disconnecting");
});
