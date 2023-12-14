//Si bien el trabajo completo está en este archivo, se hicieron algunas modificaciones en el archivo ProductManager. 
//dichos cambios están comentados! 


//Traigo express y mi archivo productManage
const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3000;

//Iniciar el servidor

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

//Configuración de la instancia de ProductManager con el archivo de productos
const productManager = new ProductManager('productos.json');

//Ruta inicial, home
app.get('/', (req,res) =>{
    res.send('Hola! hay rutas a seguir: /products , /products?limit=, /products/PId ')
})

//Utilizamos la ruta /products para devolver una cantidad solicitada de productos
app.get('/products', async (req, res) => {
    try {
        //Obtenemos la lista completa de productos con el método getProducts()
        const productos = await productManager.getProducts();

        //requerimos que se pase un limite mediante parámetros. Siempre utilizando number como tipo de dato, por eso utilizamos el método parseInt
        let limit = parseInt(req.query.limit);

        //Si se establece un limite por parametro, se envía ese límite y se ejecuta en res.send({productosSliced}), sino productos como un array de objetos con todos los prod.
        let productosSliced;
        if (!isNaN(limit)) {
            //Entre la posición 0 y la ingresada, hacemos un slice e imprimimos la cantidad de productos
            productosSliced = productos.slice(0, limit);
        } else {
            productosSliced = productos;  //Si no se proporciona un límite, devolvemos todos los productos
        }

        res.send({ productosSliced });
    } catch (error) {
        //En caso de error, se envía una respuesta con estado 500 y un mensaje de error
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

//Recibimos la ruta /products/productId 
app.get('/products/:pid', async (req, res) => {
    try {
        //Esta funcion se ejecuta igual que la del código anterior. Es necesario acalarar que luego del .params (es decir .pid), la siguiente propiedad debe 
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

