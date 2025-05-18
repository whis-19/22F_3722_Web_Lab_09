document.addEventListener("DOMContentLoaded", function () {
    function fetchProducts() {
        fetch('http://localhost:5000/api/products')
            .then(response => response.json())
            .then(products => {
                let productRows = '';
                products.forEach(product => {
                    productRows += `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.category}</td>
                            <td>${product.price}</td>
                            <td>${product.description}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit" data-id="${product.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete" data-id="${product.id}">Delete</button>
                            </td>
                        </tr>`;
                });
                document.getElementById('productTable').innerHTML = productRows;
                attachEventListeners();
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    fetchProducts();

    document.getElementById('productForm').addEventListener('submit', function (e) {
        e.preventDefault();
        let productId = document.getElementById('productId').value;
        let product = {
            name: document.getElementById('name').value,
            category: document.getElementById('category').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value
        };

        let url = 'http://localhost:5000/api/products';
        let method = 'POST';

        if (productId) {
            url = `http://localhost:5000/api/products/${productId}`;
            method = 'PUT';
        }

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            showMessage(data.message, 'success');
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            fetchProducts();
        })
        .catch(error => console.error('Error saving product:', error));
    });

    function attachEventListeners() {
        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', function () {
                let id = this.dataset.id;
                fetch(`http://localhost:5000/api/products`)
                    .then(response => response.json())
                    .then(products => {
                        let product = products.find(p => p.id == id);
                        if (product) {
                            document.getElementById('productId').value = product.id;
                            document.getElementById('name').value = product.name;
                            document.getElementById('category').value = product.category;
                            document.getElementById('price').value = product.price;
                            document.getElementById('description').value = product.description;
                        }
                    })
                    .catch(error => console.error('Error fetching product:', error));
            });
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function () {
                let id = this.dataset.id;
                fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        showMessage(data.message, 'danger');
                        fetchProducts();
                    })
                    .catch(error => console.error('Error deleting product:', error));
            });
        });
    }

    function showMessage(message, type) {
        let messageBox = document.getElementById('message');
        messageBox.className = `alert alert-${type}`;
        messageBox.textContent = message;
        messageBox.classList.remove('d-none');

        setTimeout(() => {
            messageBox.classList.add('d-none');
        }, 3000);
    }
});
