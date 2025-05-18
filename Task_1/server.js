const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lab_9'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

app.get('/api/students/check-email/:email', (req, res) => {
    const email = req.params.email;
    db.query('SELECT * FROM students WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        res.json({ available: results.length === 0 });
    });
});

app.post('/api/students/register', (req, res) => {
    const { name, email, password, department } = req.body;
    db.query('SELECT * FROM students WHERE email = ?', [email], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
        } else if (results.length > 0) {
            res.status(400).json({ success: false, message: 'Email already exists' });
        } else {
            db.query('INSERT INTO students (name, email, password, department) VALUES (?, ?, ?, ?)',
                [name, email, password, department], (err, result) => {
                    if (err) {
                        res.status(500).json({ success: false, message: 'Registration failed' });
                    } else {
                        res.json({ success: true, message: 'Registration successful' });
                    }
                });
        }
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));
