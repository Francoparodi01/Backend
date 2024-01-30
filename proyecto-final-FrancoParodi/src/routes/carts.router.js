const express = require("express");
const router = express.Router();
const fs = require('fs');

const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/cart.json");

const ProductManager = require('../controllers/productManager.js');
const productManager = new ProductManager("./src/models/products.json");

// Rutas

// http://localhost:8080/api/carts/

// Obtenemos todos los carritos
router.post('/', async (req, res) => {
    const cart = await cartManager.newCart();

    try {
        res.json(cart);
    } catch (error) {
        res.send('Error: No se pudo crear el carrito');

    }
});

// Agregamos producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        const product = await productManager.getProductById(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const result = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(result);
        console.log("Producto agregado al carrito correctamente");

    } catch (error) {
        // Manejo de errores general
        console.error('Error al intentar guardar producto en el carrito:', error.message);
        res.status(500).send('Error al intentar guardar producto en el carrito');
    }
});



// Obtenemos un carrito por su ID
router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const response = await cartManager.getCartProducts(cid);

        if (response.message && response.message === "Carrito no encontrado") {
            // Si el carrito no es encontrado, devolver un estado 404 (Not Found)
            res.status(404).json(response);
        } else {
            // Si se encuentra el carrito, devolver los productos
            res.json(response);
        }
    } catch (error) {
        // Cualquier otro error que no esté relacionado con un carrito no encontrado
        res.status(500).send('Error al intentar enviar los productos al carrito');
    }
});

module.exports = router;
