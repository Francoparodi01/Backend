const express = require('express');
const exphbs = require("express-handlebars");

const socket = require("socket.io")

const viewsRouter = require("./routes/views.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

const ProductManager = require("./db/product-manager.js");
const productManager = new ProductManager("./src/models/productos.model.js");

const productsBdRouter = require("./models/productos.model.js")

const app = express();
const port = 8080;

    
const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(express.static('img'));


// Estructura express-handlebars 
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/productsBd", productsBdRouter)


// Conección con mongoose

const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://francoparodi:Fran_2001@coderhouse.rmszdgt.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Conectado a la base de datos!"))
    .catch((error) => console.log((error)))

    // Conección con socket.io
    
    const io = socket(server);
    
    io.on('connection', async (socket) => {
        console.log('Un cliente se conectó');
        
        socket.emit("productos", await productManager.getProducts());    
        
        socket.on("deleteProduct", async (id) => {
            await productManager.deleteProduct(id);
            //Enviamos el array de productos actualizado a todos los productos:
            io.sockets.emit("productos", await productManager.getProducts());
        });
        
        socket.on("addProduct", async (producto) => {
            try {
                await productManager.addProduct(producto);
                //Enviamos el array de productos actualizado a todos los productos:
                io.sockets.emit("productos", await productManager.getProducts());
            } catch (error) {
                console.error('Error agregando producto:', error);
            }
        });
    });
