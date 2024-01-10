const fs = require("fs")
const { v4: uuidv4 } = require('uuid');

class CartManager{

    constructor(){
        this.path = "./src/models/carrito.json";
        this.carts = [];
    }
    getCarts = () => {
        try {
            const response = fs.readFileSync(this.path, 'utf8');
            const responseJson = JSON.parse(response);
            return responseJson;
        } catch (error) {
            console.error(`Error leyendo el archivo: ${error.message}`);
            return [];
        }
    }

    getCartProducts = async (id) => {
        const carts = await this.getCarts();

        const cart = carts.find(cart =>cart.id == id);

        if (cart) {
            return cart.products
        }else{
            console.log("carrito no encontrado")
        }
    }

    newCart = async () => {
        const id = uuidv4();
        const newCart = { id, products: [] };

        this.carts = await this.getCarts();
        this.carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
        return newCart;
    }

    addProductToCart = async (cartId, productId) => {
        const carts = await this.getCarts();
        const index = carts.findIndex(cart => cart.id == cartId)

        if (index != -1 ) {
            const cartProducts = await this.getCartProducts(cartId)
            const existingProductIndex = cartProducts.findIndex(product => product.productId === productId)
            
            if (existingProductIndex != -1) {
                cartProducts[existingProductIndex].quantity = cartProducts[existingProductIndex].quantity+1
            }else{
                cartProducts.push({productId, quantity : 1})
            }

            carts[index].products = cartProducts

            await fs.writeFile(this.path, JSON.stringify(carts))
        }else{
            console.log('producto no encontrado')
        }
    }


}

module.exports = CartManager;