const express = require('express');
const router = express.Router();
const fs = require('fs/promises')

const ProductManager = require('../controllers/productManager.js');
const productManager = new ProductManager("./src/models/products.json");

const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/cart.json");

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let limit = req.query.limit
        let listedProducts;

        if (!isNaN(limit)) {
            listedProducts = products.slice(0, limit);
        } else {
            listedProducts = products;
        }

        res.send({ listedProducts });
    } catch (error) {
        res.json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid
        const product = await productManager.getProductById(productId);

        if (product) {
            res.send(product);
        } else {
            res.json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Obtener los datos del nuevo producto desde el cuerpo de la solicitud
        const productData = req.body;

        // Verificar si ya existe un producto con el mismo código
        if (productManager.productExists(productData.code)) {
            return res.json({ error: 'Ya existe un producto con este código' });
        }

        // Agregar el nuevo producto utilizando el método addProduct de tu ProductManager
        const newProduct = productManager.addProduct(productData);

        if (!newProduct) {
            return res.json({ error: 'Faltan campos obligatorios para agregar el producto' });
        }

        // Convertir el array de productos a formato JSON
        const productsJson = JSON.stringify(productManager.products, null, 2);

        // Obtener la ruta del archivo desde la instancia de ProductManager
        const filePath = productManager.path;

        // Verificar si filePath está definido y es una cadena
        if (typeof filePath !== 'string') {
            throw new Error('La propiedad filePath no está definida o no es una cadena.');
        }

        // Escribir los productos actualizados de vuelta al archivo
        await fs.writeFile(filePath, productsJson, 'utf-8');

        res.json({ message: 'Producto agregado con éxito', newProduct });
    } catch (error) {
        console.error('Error al agregar producto', error.message);
        res.json({ error: 'Error al agregar producto' });
    }
});


router.put('/editProduct/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const { title, description, price, stock } = req.body;

        // Actualiza el producto utilizando el método updateProduct de tu ProductManager
        const updatedProduct = productManager.updateProduct(productId, {
            title,
            description,
            price,
            stock
        });

        if (!updatedProduct) {
            return res.json({ error: 'Producto no encontrado', productId });
        }

        res.json({ message: 'Producto actualizado con éxito', updatedProduct });
    } catch (error) {
        console.error('Error al editar producto:', error.message);
        res.json({ error: 'Error al editar producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        // Verificamos si el producto con el ID proporcionado existe
        const existingProduct = productManager.getProductById(pid);

        if (!existingProduct) {
            return res.json({ error: 'Producto no encontrado', productId: pid });
        }

        // Eliminamos el producto
        await productManager.deleteProduct(pid);

        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error('Error al intentar eliminar el producto:', error.message);
        res.send('Error al intentar eliminar el producto');
    }
});


module.exports = router;
