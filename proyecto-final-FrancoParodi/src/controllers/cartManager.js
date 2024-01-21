const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class CartManager {
    constructor() {
        this.path = "./src/models/carrito.json";
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

    async addProductToCart(cartId, productId, quantity, title) {
        this.carts = await this.getCarts();
        const index = this.carts.findIndex(cart => cart.id === cartId);

        if (index !== -1) {
            const cartProducts = this.carts[index].products;
            const existingProductIndex = cartProducts.findIndex(product => product.id === productId);
            

            if (existingProductIndex !== -1) {
                cartProducts[existingProductIndex].quantity += quantity;
            } else {
                cartProducts.push({ id: productId, title, quantity });
            }

            this.carts[index].products = cartProducts;
            await this.writeFile(this.carts);
            console.log('Producto agregado al carrito correctamente');
        } else {
            throw new Error('Carrito no encontrado');
        }
    }
}

module.exports = CartManager;
