const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Replace with your MongoDB URI
const mongoURI = "mongodb://localhost:27017/lab_9";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Database."))
    .catch(err => console.error("MongoDB connection error:", err));

// Blog Schema
const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    content: String
});

const Blog = mongoose.model("Blog", blogSchema);

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});

app.post("/api/blogs", async (req, res) => {
    try {
        const { title, author, content } = req.body;
        const blog = new Blog({ title, author, content });
        await blog.save();
        res.status(200).send("Blog post added successfully.");
    } catch (err) {
        res.status(500).send("Error adding blog post.");
    }
});

app.get("/api/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).send("Error retrieving blog posts.");
    }
});

app.get("/api/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).send("Blog post not found.");
        res.json(blog);
    } catch (err) {
        res.status(500).send("Error retrieving the blog post.");
    }
});
