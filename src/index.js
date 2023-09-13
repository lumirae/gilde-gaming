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

app.use(session({
  secret: 'your-secret-key', // Change this to a strong, random string
  resave: false,
  saveUninitialized: true
}));

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
    res.sendFile(path.resolve(__dirname + '/../home.html'), { username: req.session.username });
  } else {
    // Redirect to the login page or show an error message
    res.redirect('/');
  }
});

// Parse JSON request bodies
app.use(bodyParser.json());

app.get("/where", (req, res) => {
  res.status(301).redirect("https://www.google.com")
});


app.post('/', (req, res) => {
  if (!req.body) {
    console.log(req);
  }
  // Access the data sent from the client in req.body
  const username = req.body.username;
  const password = req.body.password;

  // Handle the data or perform authentication here
  connection.query(
    "SELECT * FROM account WHERE (user_name = ? OR email = ?) AND user_pass = ?",
    [username, username, password],
    function (error, results, fields) {
      if (results.length > 0) {
        // create session for logged in user
        req.session.username = username;

        // Send a success response to the frontend
        res.json({'success': 'success'});
        res.end();
      } else {
        // Handle authentication failure here, for example, set a message
        res.json({'error': 'login-invalid'});
        res.end();
      }
    }
  );
});

app.use('/public',express.static(__dirname + '/../public'));
app.use('/src',express.static(__dirname + '/../src'));

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Apen Race server running at http://localhost:${port}/`);
});