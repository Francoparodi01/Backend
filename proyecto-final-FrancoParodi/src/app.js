const express = require('express');
const app = express();

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js")
const port = 8080;

//Middleware
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
