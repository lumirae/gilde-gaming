const cors = require("cors");
const path = require("path");
const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

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

// Import auth routes and controller
const authRoutes = require("./routes/authRoute");
app.use("/auth", authRoutes);

// Define your routes here
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/index.html"));
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
  socket.on("chat message", (msg) => {
    // Get the username from the session
    const username = socket.request.session.username || "Anonymous";

    // Send the message with the format "username: message"
    const formattedMessage = `${username} : ${msg}`;
    io.emit("chat message", formattedMessage);
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
