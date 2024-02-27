const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3555;
const secretKey = "server.js"; // Change this to a secure secret key

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database("users.db");

// Create users table if not exists
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
  );
});

const checkToken = (req, res, next) => {
  let token = req.header("Authorization");
  token = token.slice(7);

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token missing" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorised - Invalid Token" });
  }
};

// Signup endpoint
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (row) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Insert new user into the database
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(201).json({ message: "User created successfully" });
      }
    );
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check credentials against database
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (row) {
        // Generate a JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
        // Send the token as a response
        res.json({ token });
      } else {
        // Return unauthorized if credentials are invalid
        res.status(401).json({ error: "Invalid credentials" });
      }
    }
  );
});

app.get("/dashboard", checkToken, (req, res) => {
  const { username } = req.user;
  res.json({ message: `Welcome to the dashboard, ${username}!` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
