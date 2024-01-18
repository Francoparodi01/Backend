const express = require('express');
const exphbs = require("express-handlebars");
const http = require('http');

const socketIO = require("socket.io")

const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/productos.json");

const app = express();
const port = 8080;
const httpServer = http.createServer(app); 


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// express-handlebars structure
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Connection with socket.io

const io = socketIO(httpServer);

io.on('connection', async (socket) => {
    console.log('Un cliente se conectó');
    try {
        const products = await productManager.getProducts();
        socket.emit('productos', products);
    } catch (error) {
        console.error('Error al leer los productos:', error.message);
    }
});

httpServer.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
