const express = require('express');
const router = express.Router();

const ProductManager = require('../controllers/productManager.js');
const productManager = new ProductManager("./src/models/productos.json");

const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carrito.json");

router.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let limit = parseInt(req.query.limit);
        let listedProducts;

        if (!isNaN(limit)) {
            listedProducts = products.slice(0, limit);
        } else {
            listedProducts = products;
        }

        res.send({ listedProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.send(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { productId, quantity, cartId } = req.body;
        const product = productManager.getProductById(productId);
        const cart = cartManager.getCartById(cartId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log('cartId:', cartId);
        await cartManager.addProductToCart(cartId, productId, quantity);

        res.json({ message: 'Producto agregado al carrito con éxito' });
    } catch (error) {
        console.error('Error al agregar producto al carrito', error.message);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

router.put('/editarProducto', async (req, res) => {
    try {
        const { id, title, description, price, thumbnail, code, stock } = req.body;
        const response = await productManager.updateProduct(id, { title, description, price, thumbnail, code, stock });
        res.send(response);

        const updatedProducts = await productManager.getProductById(id);   
        console.log(updatedProducts);
    } catch (error) {
        console.log('Error al editar producto:', error.message);
        res.status(500).send({ error: 'Error al editar producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(pid);
        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.log('Error al intentar eliminar', error);
        res.status(500).send('Error al intentar eliminar el producto');
    }
});

module.exports = router;
