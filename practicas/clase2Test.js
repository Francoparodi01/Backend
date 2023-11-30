class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios
        if (![title, description, price, thumbnail, code, stock].every(Boolean)) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        // Validar que no se repita el campo "code"
        if (this.products.some(product => product.code === code)) {
            console.log(`Ya existe un producto con el código ${code}.`);
            return;
        }

        // Generar un id autoincrementable
        const newId = this.products.length + 1;

        // Crear el nuevo producto
        const newProduct = {
            id: newId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };

        // Agregar el nuevo producto al arreglo de productos
        this.products.push(newProduct);

        console.log(`Producto '${title}' agregado correctamente con ID ${newId}.`);
    }

    getProducts() {
        // Devolver el arreglo con todos los productos creados hasta el momento
        return this.products;
    }

    getProductById(id) {
        // Buscar el producto por ID
        const product = this.products.find(product => product.id === id);

        // Mostrar en consola un error si no se encuentra el producto
        if (!product) {
            console.log(`Producto con ID ${id} no encontrado.`);
        }

        return product;
    }
}

// Ejemplo de uso
const productManager = new ProductManager();

productManager.addProduct("Producto 1", "Descripción 1", 19.99, "imagen1.jpg", "001", 50);
productManager.addProduct("Producto 2", "Descripción 2", 29.99, "imagen2.jpg", "002", 30);
productManager.addProduct("Producto 3", "Descripción 3", 39.99, "imagen3.jpg", "003", 20);
productManager.addProduct("Producto 4", "Descripción 4", 49.99, "imagen4.jpg", "004", 10);

// Buscar un producto por ID
const productIdToSearch = 2;
const foundProduct = productManager.getProductById(productIdToSearch);

// Mostrar el resultado
console.log(foundProduct);
