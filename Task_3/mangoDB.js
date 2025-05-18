const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your MongoDB URI
const mongoURI = "mongodb://localhost:27017/lab_9";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Database"))
    .catch(err => console.error("Database connection failed:", err));

// Define Feedback schema and model
const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.get("/api/feedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ created_at: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/api/feedback", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const feedback = new Feedback({ name, email, message });
        await feedback.save();
        res.json({ message: "Feedback submitted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Error saving feedback" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
