const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace with your actual MongoDB URI
const mongoURI = 'mongodb://localhost:27017/lab_9';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Database'))
    .catch(err => console.error('MongoDB Connection Failed:', err));

// Create Product schema and model
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String
});

const Product = mongoose.model('Product', productSchema);

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
});

// Add a new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        const product = new Product({ name, category, price, description });
        await product.save();
        res.json({ success: true, message: "Product added successfully", id: product._id });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error adding product" });
    }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, category, price, description });
        res.json({ success: true, message: "Product updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating product" });
    }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting product" });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
