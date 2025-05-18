const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lab_9",
});

app.get("/api/todos", (req, res) => {
    db.query("SELECT * FROM todos", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

app.post("/api/todos", (req, res) => {
    const { task } = req.body;
    db.query("INSERT INTO todos (task) VALUES (?)", [task], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task added successfully" });
    });
});

app.put("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    db.query("UPDATE todos SET task = ?, completed = ? WHERE id = ?", [task, completed, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task updated successfully" });
    });
});

app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Task deleted successfully" });
    });
});


app.listen(5000, () => console.log(`Server running on port 5000`));
