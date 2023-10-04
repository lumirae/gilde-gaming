const cors = require("cors");
const path = require("path");
const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const WaitingRoomManager = require('./controllers/waitingRoomController'); // Import the WaitingRoomManager class

// Create an instance of WaitingRoomManager
const waitingRoomManager = new WaitingRoomManager();

// Create a session store using express-session
const sessionMiddleware = session({
  secret: "your-secret-key", // Change this to a strong, random string
  resave: false,
  saveUninitialized: true,
});

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);

// Serve static files
app.use("/public", express.static(path.resolve(__dirname, "../../public")));
app.use("/src", express.static(path.resolve(__dirname, "../../src")));

// Define your routes here
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/index.html"));
});

// Import language routes and controller
const languageRoutes = require("./routes/languageRoute");
app.use("/language", languageRoutes);

// Import waitingRoom routes and controller
const waitingRoomRoutes = require("./routes/waitingRoomRoute");
app.use("/waitingRoom", waitingRoomRoutes);

// Import auth routes and controller
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes);

// Serve language files from the 'languages' folder
app.get("/language/:lang", (req, res) => {
  const lang = req.params.lang;
  res.sendFile(path.resolve(__dirname, `../languages/${lang}.json`));
});

app.get("/home", (req, res) => {
  // Check if the user is logged in
  if (req.session.username) {
    // Render the user's profile page with their username
    res.sendFile(path.resolve(__dirname, "../client/home.html"));
  } else {
    // Redirect to the login page or show an error message
    res.redirect("/");
  }
});

app.get("/game", (req, res) => {
  // Check if the user is logged in
  if (req.session.username) {
    // Render the user's profile page with their username
    res.sendFile(path.resolve(__dirname, "../client/game.html"));
  } else {
    // Redirect to the login page or show an error message
    res.redirect("/");
  }
});

io.use((socket, next) => {
  // Use the session middleware to initialize the session
  sessionMiddleware(socket.request, {}, next);
});

io.on("connection", (socket) => {

  socket.on("voteSkip", (lobby) => {
    // console.log("Received voteSkip from client with lobby data:", lobby);
    waitingRoomManager.voteSkip(io, socket, lobby);
  });

  socket.on("voteStay", (lobby) => {
    console.log("Received voteStay from client with lobby data:", lobby);
    waitingRoomManager.voteStay(io, socket, lobby);
  });

  // Handle a user joining the waiting room
  socket.on("joinWaitingRoom", (data) => {
    const lobby = data.lobby;
    const username = socket.request.session.username;
    socket.emit("joinedWaitingRoom", { username, lobby });

    waitingRoomManager.joinWaitingRoom(socket, io, username);
  });

  // Handle user disconnections
  socket.on("disconnect", () => {
    waitingRoomManager.handleDisconnect(socket, io);
  });

  // Handle user leaving queue
  socket.on("disconnectFromQueue", () => {
    console.log('Received disconnectRequest from client');
    waitingRoomManager.handleDisconnect(socket, io);
  });

  // Handle chat messages
  socket.on("chat message", (msg) => {
    // Get the username from the session
    const username = socket.request.session.username || "Anonymous";

    // Send the message with the format "username: message"
    const formattedMessage = `${username} : ${msg}`;
    io.emit("chat message", formattedMessage);
  });

  // Handle reconnection
  socket.on("reconnect", () => {
    // You can implement reconnection logic here if needed
    // For example, you can send the client a new serverTimestamp
    const serverTimestamp = Date.now();
    socket.emit("reconnected", { serverTimestamp });
  });
});
// logout
app.post("/logout", (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      // Handle logout error (if any)
      res.status(500).json({ error: "logout-failed" });
    } else {
      // Successful logout
      res.sendStatus(200);
    }
  });
});

// Start the server
http.listen(port, () => {
  console.log(`Apen Race server running at http://localhost:${port}/`);
});

// Export the app for testing or other use
module.exports = app;
