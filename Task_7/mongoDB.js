const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Replace with your MongoDB URI
const mongoURI = "mongodb://localhost:27017/lab_9";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Database."))
    .catch(err => console.error("Database connection failed:", err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    // Add other fields as needed
});

const User = mongoose.model("User", userSchema);

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});

app.post("/api/login", async (req, res) => {
    console.log("Login request received:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password required" });
    }

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            console.log("User found:", user);
            res.status(200).json({ success: true, userId: user._id });
        } else {
            console.log("Invalid credentials");
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    } catch (err) {
        console.error("Error checking user:", err);
        res.status(500).send("Error checking user.");
    }
});

app.get("/api/user/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send("User not found.");
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).send("Error fetching user data.");
    }
});
