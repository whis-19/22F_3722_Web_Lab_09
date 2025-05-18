const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lab_9"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL Database.");
});

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});

app.post("/api/login", (req, res) => {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const sql = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error checking user:", err);
            return res.status(500).send("Error checking user.");
        }

        if (result.length > 0) {
            console.log("User found:", result[0]);
            res.status(200).json({ success: true, userId: result[0].id });
        } else {
            console.log("Invalid credentials");
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    });
});

app.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;
    const sql = `SELECT * FROM users WHERE id='${userId}'`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).send("Error fetching user data.");
        }

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).send("User not found.");
        }
    });
});
