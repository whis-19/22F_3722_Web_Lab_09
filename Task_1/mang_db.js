const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your MongoDB URI
const mongoURI = 'mongodb://localhost:27017/lab_9';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    department: String
});

const Student = mongoose.model('Student', studentSchema);

app.get('/api/students/check-email/:email', async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.params.email });
        res.json({ available: !student });
    } catch (err) {
        res.status(500).json({ available: false });
    }
});

app.post('/api/students/register', async (req, res) => {
    const { name, email, password, department } = req.body;
    try {
        const existing = await Student.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        const student = new Student({ name, email, password, department });
        await student.save();
        res.json({ success: true, message: 'Registration successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
