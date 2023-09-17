const bcrypt = require('bcrypt');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();
app.use(cors());
app.use(express.json());
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// Create a session store using express-session
const sessionMiddleware = session({
  secret: 'your-secret-key', // Change this to a strong, random string
  resave: false,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

// database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apen_race"
});

// connect to the database
connection.connect(function(error){
  if (error) throw error
  else console.log("connected to the database successfully!")
});

// routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../index.html'));
});

app.get('/home', (req, res) => {
  // Check if the user is logged in
  if (req.session.username) {
    // Render the user's profile page with their username
    res.sendFile(path.resolve(__dirname + '/../home.html'));
  } else {
    // Redirect to the login page or show an error message
    res.redirect('/');
  }
});

// Parse JSON request bodies
app.use(bodyParser.json());

app.post('/', (req, res) => {
  if (!req.body) {
    console.log(req);
  }
  // Access the data sent from the client in req.body
  const username = req.body.username;
  const password = req.body.password;

  // Retrieve the hashed password from the database using the username or email
  connection.query(
    "SELECT user_pass FROM account WHERE user_name = ? OR email = ?",
    [username, username],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        // Handle the database error (e.g., send an error response)
        res.json({ 'error': 'login-failed' });
        res.end();
      } else if (results.length === 1) {
        // Compare the entered password with the hashed password
        const hashedPassword = results[0].user_pass;
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            console.error(err);
            // Handle the bcrypt error (e.g., send an error response)
            res.json({ 'error': 'login-failed' });
            res.end();
          } else if (result === true) {
            // Passwords match, user is authenticated
            req.session.username = username;
            res.json({ 'success': 'success' });
            res.end();
          } else {
            // Passwords do not match, authentication failed
            res.json({ 'error': 'login-invalid' });
            res.end();
          }
        });
      } else {
        // No user with the given username or email found
        res.json({ 'error': 'login-invalid' });
        res.end();
      }
    }
  );
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      // Handle error (e.g., log it or send an error response)
      console.error(err);
      res.json({ 'error': 'registration-failed' });
      res.end();
    } else {
      // Store the hashed password in the database
      connection.query(
        "INSERT INTO account (user_name, email, user_pass) VALUES (?, ?, ?)",
        [username, email, hash], // Use the hash instead of the plain password
        function (error, results, fields) {
          if (!error) {
            // Registration successful
            res.json({ 'success': 'success' });
            res.end();
          } else {
            // Handle other registration errors
            console.error(error);
            res.json({ 'error': 'registration-failed' });
            res.end();
          }
        }
      );
    }
  });
});

app.use('/public', express.static(__dirname + '/../public'));
app.use('/src', express.static(__dirname + '/../src'));

io.use((socket, next) => {
  // Use the session middleware to initialize the session
  sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    // Get the username from the session
    const username = socket.request.session.username || 'Anonymous';

    // Send the message with the format "username: message"
    const formattedMessage = `${username} : ${msg}`;
    io.emit('chat message', formattedMessage);
  });
});

http.listen(port, () => {
  console.log(`Apen Race server running at http://localhost:${port}/`);
});

// logout
app.post('/logout', (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      // Handle logout error (if any)
      res.status(500).json({ 'error': 'logout-failed' });
    } else {
      // Successful logout
      res.sendStatus(200);
    }
  });
});