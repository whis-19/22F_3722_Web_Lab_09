const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your MongoDB URI
const mongoURI = "mongodb://localhost:27017/lab_9";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Todo schema
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/todos", async (req, res) => {
    try {
        const { task } = req.body;
        const todo = new Todo({ task });
        await todo.save();
        res.json({ message: "Task added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/api/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { task, completed } = req.body;
        await Todo.findByIdAndUpdate(id, { task, completed });
        res.json({ message: "Task updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete("/api/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log(`Server running on port 5000`));
