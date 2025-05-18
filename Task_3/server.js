const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

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
    console.log("Connected to MySQL Database");
});
app.get("/api/feedback", (req, res) => {
    db.query("SELECT * FROM feedback ORDER BY created_at DESC", (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
            return;
        }
        res.json(results);
    });
});

app.post("/api/feedback", (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = "INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error saving feedback" });
        }
        res.json({ message: "Feedback submitted successfully!" });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
