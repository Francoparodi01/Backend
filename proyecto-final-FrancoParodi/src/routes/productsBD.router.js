const express = require("express");
const router = express.Router();

// Importamos el modelo
const productModel = require("../models/productos.model.js");

// Obtengo los productos
router.get("/", async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor, productos no encontrados" });
    }
});

module.exports = router;
