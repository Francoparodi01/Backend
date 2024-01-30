const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class CartManager {
    constructor() {
        this.path = "./src/models/cart.json";
        this.carts = [];
    }

    async getCarts() {
        try {
            const response = await fs.readFile(this.path, 'utf8');
            return JSON.parse(response);
        } catch (error) {
            console.error(`Error leyendo el archivo: ${error.message}`);
            return [];
        }
    }

    async writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
    }

    async getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    async getCartProducts(id) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id == id);

        if (cart) {
            return cart.products;
        } else {
            throw new Error("Carrito no encontrado");
        }
    }

    async newCart() {
        const id = uuidv4();
        const newCart = { id, products: [] };

        this.carts = await this.getCarts();
        this.carts.push(newCart);

        await this.writeFile(this.carts);
        return newCart;
    }

    async addProductToCart(cartId, productId, title, quantity = 1) {
        try {  
            // Obtén los carritos actuales
            this.carts = await this.getCarts();
    
            // Busca el carrito por su ID
            const index = this.carts.findIndex(cart => cart.id === cartId);
    
            if (index !== -1) {
                // Obtiene los productos del carrito actual
                const cartProducts = this.carts[index].products;
    
                // Busca el índice del producto en el carrito
                const existingProductIndex = cartProducts.findIndex(product => product.id === productId);
    
                if (existingProductIndex !== -1) {
                    // Si el producto ya existe en el carrito, actualiza la cantidad
                    cartProducts[existingProductIndex].quantity += quantity;
                } else {
                    // Si el producto no existe en el carrito, agrega el producto al carrito con la cantidad proporcionada
                    cartProducts.push({ id: productId, title, quantity });
                }
    
                // Actualiza los productos en el carrito y escribe en el archivo
                this.carts[index].products = cartProducts;
                await this.writeFile(this.carts);
                console.log('Producto agregado al carrito correctamente');
                return { message: 'Producto agregado al carrito correctamente' };
            } else {
                // Si el carrito no existe, devuelve un objeto con un mensaje indicando que el carrito no fue encontrado
                console.log(`El carrito con el ID ${cartId} no existe.`);
                return { message: 'Carrito no encontrado' };
            }
        } catch (error) {
            // Manejo de errores general
            console.error('Error al intentar agregar producto al carrito:', error.message);
            return { message: 'Error al intentar agregar producto al carrito' };
        }
    }
    
}

module.exports = CartManager;
