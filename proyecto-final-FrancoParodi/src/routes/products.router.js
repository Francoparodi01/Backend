const express = require("express")
const router = express.Router()

const ProductManager = require("../controllers/productManager")
const productManager = new ProductManager("./src/models/productos.json")

const CartManager = require("../controllers/cartManager")
const cartManager = new CartManager("./src/models/carrito.json")

router.get('/products', async (req, res) => {
    try {
        //Obtenemos la lista completa de productos con el método getProducts()
        const productos = await productManager.getProducts();

        //requerimos que se pase un limite mediante parámetros. Siempre utilizando number como tipo de dato, por eso utilizamos el método parseInt
        let limit = parseInt(req.query.limit);

        //Si se establece un limite por parametro, se envía ese límite y se ejecuta en res.send({productosSliced}), sino productos como un array de objetos con todos los prod.
        let productosListados;
        if (!isNaN(limit)) {
            //Entre la posición 0 y la ingresada, hacemos un slice e imprimimos la cantidad de productos
            productosListados = productos.slice(0, limit);
        } else {
            productosListados = productos;  //Si no se proporciona un límite, devolvemos todos los productos
        }

        res.send({ productosListados });
    } catch (error) {
        //En caso de error, se envía una respuesta con estado 500 y un mensaje de error
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

//Recibimos la ruta /products/productId 
router.get('/:pid', async (req, res) => {
    try {
        //Esta funcion se ejecuta igual que la del código anterior. Es necesario acalarar que luego del .params (es decir .pid), la propiedad debe 
        //coincidir con /:pid de la ruta. Sino, devuelve error  
        const productId = parseInt(req.params.pid);
        //Traemos de manera asincrónica el ID requerido  
        const product = await productManager.getProductById(productId);
        
        //Método if => si resuelve true => devuelve el producto con los id listados. si devuelve false => Error 404
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

        // Utiliza las instancias existentes de ProductManager y CartManager
        const product = productManager.getProductById(productId);

        const cart = cartManager.getCartById(cartId)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log('cartId:', cartId);

        // Añade el producto al carrito utilizando las instancias existentes
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
    } catch (error) {
        console.log('Error al editar producto:', error.message); // Imprime el error en la consola
        res.status(500).send({ error: 'Error al editar producto' }); // Envía una respuesta de error al cliente
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


module.exports = router