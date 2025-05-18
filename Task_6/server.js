const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "lab_9"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database.");
});

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});

app.post("/api/blogs", (req, res) => {
    const { title, author, content } = req.body;
    const sql = `INSERT INTO blogs (title, author, content) VALUES ('${title}', '${author}', '${content}')`;
    db.query(sql, (err) => {
        if (err) return res.status(500).send("Error adding blog post.");
        res.status(200).send("Blog post added successfully.");
    });
});

app.get("/api/blogs", (req, res) => {
    const sql = "SELECT * FROM blogs";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send("Error retrieving blog posts.");
        res.json(results);
    });
});

app.get("/api/blogs/:id", (req, res) => {
    const blogId = req.params.id;
    const sql = `SELECT * FROM blogs WHERE id = '${blogId}'`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send("Error retrieving the blog post.");
        if (result.length === 0) return res.status(404).send("Blog post not found.");
        res.json(result[0]);
    });
});
