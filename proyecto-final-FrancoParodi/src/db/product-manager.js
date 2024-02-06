const ProductModel = require("../models/productos.model.js");

class ProductManager{
    async addProduct(productData) {
            // Validamos campos obligatorios
            if (!productData.id || !productData.title || !productData.description || !productData.price || !productData.code || !productData.stock || !productData.category || !productData.thumbnails) {
                console.log("Todos los campos son obligatorios")
                return ;
            }

            // Generamos un nuevo ID único
            const newId = uuidv4();
    
            // Creamos un nuevo producto con los datos proporcionados y valores predeterminados
            const newProduct = new ProductModel( {
                id: newId,
                title: productData.title,
                description: productData.description || '',
                price: productData.price,
                code: productData.code,
                stock: productData.stock || 0,
                status: true, // Valor predeterminado
                category: productData.category || '',
                thumbnails: productData.thumbnails || []
            });
             
            await newProduct.save()

            // Agregamos el nuevo producto al array de productos
            this.products.push(newProduct);
            return newProduct;
        }
    async loadProducts() {
        try {
            const products = await ProductModel.find()
            return products
        } catch (error) {
            console.error(`Error trayendo productos`);
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

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id)
        if (!product) {
           console.log("Producto no encontrado")
           return null;
        }
        console.log("Producto encontrado!")
        return product;
        } catch (error) {
            console.log("Error al traer producto por id")
        }
    }

    
    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto actualizado!");
            return updatedProduct;
        } catch (error) {
            console.log("No se pudo actualizar el producto:", error);
            throw error;
        }
    }
    
    
    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id)

            if (!deletedProduct) {
                console.log("No se encuentra el producto")
                return null;
            };
            console.log("Producto eliminado correctamente")
        } catch (error) {
            console.error(`Error al eliminar producto`, error);
            throw error; 
        }
    }
}

module.exports = ProductManager