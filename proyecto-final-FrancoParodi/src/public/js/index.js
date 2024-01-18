const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/productos.json");

io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");
    try {
        const products = await productManager.getProducts();
        socket.emit("productos", products); 
        console.log(products)
    } catch (error) {
        console.error("Error al leer los productos:", error.message);
    }
});
