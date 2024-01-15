const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = this.loadProducts();
    }

    addProduct(productData) {
        // Validar campos obligatorios
        if (!productData.title || !productData.price || !productData.code) {
            throw new Error('Campos obligatorios (title, price, code) no proporcionados');
        }

        const newId = uuidv4();

        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description || '',
            price: productData.price,
            thumbnail: productData.thumbnail || '',
            code: productData.code,
            stock: productData.stock || 0
        };
         
        // Agrega el nuevo producto al array de productos
        this.products.push(newProduct);
        // Guarda los productos actualizados en el archivo
        this.saveProducts();
        // Muestra los productos por consola
        console.log(`Producto '${productData.title}' agregado con el nuevo ID ${newId}.`);
        
        return newProduct;
    }
    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.error(`Error leyendo el archivo: ${error.message}`);
            return [];
        }
    }

    saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data);
            console.log('Se guardaron tus productos.');
        } catch (error) {
            console.error(`Error escribiendo archivo: ${error.message}`);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id == id);
        if (product) {
            return product;
        } else {
            console.log(`El producto con el ID número ${id}. No fue encontrado.`);
        }
    }

    updateProduct(id, updatedFields) {
        try {
            const productIndex = this.products.findIndex(product => product.id == id);
            if (productIndex !== -1) {
                // Validar campos permitidos y necesarios antes de la actualización
                const allowedFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
                Object.keys(updatedFields).forEach(field => {
                    if (!allowedFields.includes(field)) {
                        throw new Error(`Campo no permitido: ${field}`);
                    }
                });

                this.products[productIndex] = {
                    ...this.products[productIndex], 
                    ...updatedFields, 
                    id: this.products[productIndex].id 
                };
                this.saveProducts();
                console.log(`El producto con el número de ID ${id} se actualizó`);
                return this.products[productIndex];
            } else {
                console.log(`El producto con el número de ID ${id} no fue encontrado`);
                return null;
            }
        } catch (error) {
            console.error(`Error al actualizar producto: ${error.message}`);
            throw error; // Re-lanza la excepción para que pueda manejarse adecuadamente fuera de la clase
        }
    }

    deleteProduct(id) {
        try {
            const productIndex = this.products.findIndex(product => product.id == id);

            if (productIndex !== -1) {
                const deletedProduct = this.products.splice(productIndex, 1)[0];
                this.saveProducts();
                console.log(`El producto con el número de ID ${id} fue eliminado.`);
                return deletedProduct;
            } else {
                console.log(`El producto con el número de ID ${id} no fue encontrado.`);
                throw new Error(`El producto con el número de ID ${id} no fue encontrado.`);
            }
        } catch (error) {
            console.error(`Error al eliminar producto: ${error.message}`);
            throw error; // Relanza la excepción para que pueda manejarse adecuadamente fuera de la clase
        }
    }
}

module.exports = ProductManager;
