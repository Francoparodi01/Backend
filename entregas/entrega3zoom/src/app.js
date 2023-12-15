const express = require("express");
const ProductManager = require("./productManager")

const app = express();
const PORT = 3000

//iniciamos server
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

const productManagerJson = new ProductManager('../productos.json')

app.get('/', (req,res) => {
    res.send('Hola! hay rutas a seguir: /products , /products?limit=, /products/PId ')
})

app.get('/products', async (req, res) =>{
    try{
        const productos = await productManagerJson.getProducts()

        let limit = parseInt(req.query.limit)

        let productosSliced;
        if (!isNaN(limit)){
            productosSliced = productos.slice(0,limit)
        } else{
            productosSliced = productos
        }
        res.send({productosSliced})


    } catch (error) {
        res.status(500).json({error: 'al obtener productos'})
    }
})

app.get('/products/:pid', async (req,res) => {
    try {
        //Usamos query params para tomar el valor de id asignado x url
        let productId = parseInt(req.params.pid)

        const product = await productManagerJson.getProductById(productId)

        if (product) {
            res.send(product)
        } else {
            res.status(404).json ({error: 'producto no encontrado'})
        }

    } catch (error) {
        res.status(501).json({error: 'Producto con id no encontrado'})
    }
})


