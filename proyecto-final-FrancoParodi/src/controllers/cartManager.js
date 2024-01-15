const fs = require("fs")
const { v4: uuidv4 } = require('uuid');
//se usa uuidv4 para generar ids automáticos! 

class CartManager{

    constructor(){
        this.path = "./src/models/carrito.json";
        this.carts = [];
    }
    //Traemos todos lo carritos leyendo el carrito.json
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

    getCartById(id) {
        const cart = this.carts.find(cart => cart.id == id);
        if (cart) {
            return cart;
        } else {
            console.log(`El carrito con el ID número ${id}. No fue encontrado.`);
        }
    }

    
    //Función que trae los productos por id del carrito
    getCartProducts = async (id) => {
        //asincrónicamente llamamos la funcion getcarts utilizando la prop. this para entrar en la clase CartManager
        const carts = await this.getCarts();
        //Método find => Si por cada carrito de carts existe un carrito con ese id y que también coincida con el id pasado por parámetros, lo guardamos 
        // en la variable "cart" y lo pasamos al if
        const cart = carts.find(cart =>cart.id == id);

        //Donde si cart existe, retornamos productos, y sino clg
        if (cart) {
            return cart.products;
        } else {
            throw new Error("Carrito no encontrado");
        }
        
    }

    //Función que crea un nuevo carrito 
    newCart = async () => {
        //Utilizamos la dependencia instalada para generar ids automáticos
        const id = uuidv4();
        //Creamos un carrito como objeto con dos propiedades
        const newCart = { id, products: [] };
        //getCarts nos trae todos los carritos existentes. Usamos this.carts para actualizar la lista en el array vacío.
        //Con el método push, empujamos el nuevo carrito a la lista completa.
        this.carts = await this.getCarts();
        this.carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        return newCart;
    }


    addProductToCart = async (cartId, productId) => {
            //Obtenemos todos los carritos
            const carts = await this.getCarts();
    
            //Mediante la funcion findIndex, buscamos el indice del id pasado por params
            const index = carts.findIndex(cart => cart.id === cartId);
    
            //Si encontramos el carrito
            if (index !== -1) {
                //Obtenemos la lista de productos del carrito
                const cartProducts = carts[index].products
    
                //Buscamos el índice del producto en el carrito si existe
                const existingProductIndex = cartProducts.findIndex(product => product.title === productId);
    
                //Si existe
                if (existingProductIndex !== -1) {
                    //Incrementamos a 1 la cantidad de ese producto
                    cartProducts[existingProductIndex].quantity = (cartProducts[existingProductIndex].quantity || 0) + 1;
                } else {
                    //Si no existe lo agregamos con la cantidad = 1
                    cartProducts.push({ title: productId, quantity: 1 });
                }
    
                //Actualizamos la lista de productos
                carts[index].products = cartProducts;
    
                //Escribimos los cambios en el json
                await fs.promises.writeFile(this.path, JSON.stringify(carts));
            } else {
                //Error si no hay carrito
                throw new Error('Carrito no encontrado');
            }
    }
}

module.exports = CartManager;