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
    if (err) {
        console.error('MySQL Connection Failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

app.get('/api/products', (req, res) => {
    const query = "SELECT * FROM products";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error fetching products" });
        } else {
            res.json(results);
        }
    });
});

app.post('/api/products', (req, res) => {
    const { name, category, price, description } = req.body;
    const query = `INSERT INTO products (name, category, price, description) VALUES ('${name}', '${category}', ${price}, '${description}')`;
    
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error adding product" });
        } else {
            res.json({ success: true, message: "Product added successfully", id: result.insertId });
        }
    });
});

app.put('/api/products/:id', (req, res) => {
    const { name, category, price, description } = req.body;
    const id = req.params.id;
    const query = `UPDATE products SET name = '${name}', category = '${category}', price = ${price}, description = '${description}' WHERE id = ${id}`;
    
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error updating product" });
        } else {
            res.json({ success: true, message: "Product updated successfully" });
        }
    });
});

app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM products WHERE id = ${id}`;
    
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error deleting product" });
        } else {
            res.json({ success: true, message: "Product deleted successfully" });
        }
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));
