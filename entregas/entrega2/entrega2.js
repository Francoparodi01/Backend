//Importamos el modulo 'file system' de NOde.js

const fs = require('fs');

//Definimos productManager con su constructor correspondiente. recibimos la ruta del archivo con filePath  como parámetro 
class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        //Aca traemos el loadProducts para cargar los productos
        this.products = this.loadProducts();
    }

    //Funcion que carga los procutos desde el archivo
    //De manera sincrónica recibo el archivo con data y con el metodo parse paso el archivo json a un objeto
    //si no hay datos recibidos, la funcion devuelve un array vacio. Tambien devuelve el mismo array si hay un error leyendo el archivo
    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.error(`Error leyendo el archivo: ${error.message}`);
            return [];
        }
    }
    //Método para guardar los productos en el archivo
    saveProducts() {
        try {
            //Convierte los productos a formato JSON y escribe en el archivo
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data);
            console.log('Se guardaron tus productos.');
        } catch (error) {
            console.error(`Error escribiendo archivo: ${error.message}`);
        }
    }

    addProduct(productData) {
        const newId = this.products.length + 1;

        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            price: productData.price,
            thumbnail: productData.thumbnail,
            code: productData.code,
            stock: productData.stock
        };
         
        //Agrega el nuevo producto al array de productos
        this.products.push(newProduct);
        //Guarda los productos actualizados en el archivo
        this.saveProducts();
        //Muestro los productos por consola
        console.log(`Producto '${productData.title}' agregado con el nuevo ID ${newId}.`);
    }

    //Se obtienen todos los productos por consola
    getProducts() {
        console.log(this.products);
    }

    //Busco el producto utilizando el metodo .find con el ID proporcionado en la ejecucion de la función, pasando el id como parámetro.
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
    
        if (product) {
            console.log(`El producto con ID número ${id} es:`, product);
        } else {
            console.log(`El producto con el ID número ${id}. No fue encontrado.`);
        }
    }
    

    //Método para actualizar un producto por ID con nuevos campos. 
    updateProduct(id, updatedFields) {
        //Utilizo findIndex para buscar el índice del producto en el array por su ID. 
        //La idea de usar findIndex es que el mismo nos va a devolver la posicion del prpducto con el mismo array 
        const productIndex = this.products.findIndex(product => product.id === id);
        
        //si el index (posición del producto) es distinto a -1 (osea digamos¿?, inexistente) y existe, pasa por 3 funciones distintas
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex], //Aca mantenemos los campos
                ...updatedFields, //Actualiza con los campos nuevos
                id: this.products[productIndex].id //Mantiene el ID
            };
            
            //con esta funcion guardamos los productos actualizados en el archivo
            this.saveProducts();
            console.log(`El producto con el número de ID ${id} se actualizó`);
        } else {
            console.log(`El producto con el número de ID ${id} no fue encontrado`);
        }
    }
    
    //Función que elimina un producto proporcionando el ID del mismo por parámetro.
    deleteProduct(id) {
        //misma explicación que la función anterior. Buscar la posicion del producto a eliminar dentro del array coincidiendo con el Id ingresado
        const productIndex = this.products.findIndex(product => product.id === id);
        
        if (productIndex !== -1) {
            //Como ya determinamos la posicion del array en la variable productIndex, utilizamos el método splice para eliminar esa posición
            this.products.splice(productIndex, 1);
            //guardamos cambios
            this.saveProducts();
            console.log(`El producto con el número de ID ${id} fue eliminado.`);
        } else {
            console.log(`El producto con el número de ID ${id} no fue encontrado.`);
        }
    }
}

//Uso de la clase ProductManager
const productManager = new ProductManager('productos.json');

//Agregando productos con valores predefinidos

productManager.addProduct({
    title: "Televisor HD",
    description: "televisor 60 pulgadas full hd",
    price: "$50.000",
    thumbnail: "imagen.jpg",
    code: "001",
    stock: 600
});

productManager.addProduct({
    title: "iphone 13",
    description: "El peor celular del mercado",
    price: "$1.000.000",
    thumbnail: "imagen.jpg",
    code: "002",
    stock: 3
});

productManager.addProduct({
    title: "Teclado razer blackwidow v2",
    description: "Teclado mecánico con switches blue",
    price: "$90.000",
    thumbnail: "imagen.jpg",
    code: "003",
    stock: 25
});

//Obtengo los productos por consola
productManager.getProducts();


//A la hora de actualizar el producto, la función se ejecuta con dos parámetros.
//En primer lugar pasamos el ID del producto que quiero actualizar
const productIdToUpdate = 1; 
//En el siguiente parámetro, debemos pasar una actualización del producto a modificar
const updatedFields = {
    description: "Nuevo televisor 4K",
    price: "$60.000",
    stock: 700
};
//Ejecutamos la funcion con el precio modificado
productManager.updateProduct(productIdToUpdate, updatedFields);
//Obtener los productos después de la actualización
productManager.getProducts();

//Impirimimos IDs 1,2,3 
productManager.getProductById(1)

//Borramos el item con ID 2
productManager.deleteProduct(2)
productManager.getProducts()