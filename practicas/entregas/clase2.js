class ProductManager {
    constructor(){
        this.products = []
    }

 
    
    addProduct(title, description, price, thumbnail, code, stock) {
        !([title, description, price, thumbnail, code, stock].every(Boolean))
            ? console.log("Todos los campos son obligatorios")
            : null;

        this.products.some(product => product.code === code)
        ? (console.log(`Ya existe un producto con el codigo ${code}`))
            : null;
            
        const newId = this.products.length +1;

        const newProduct = {
            id: newId,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        };

        //esto agarra el newProduct -> lo lleva a products y lo pushea (me costo esta parte XD)
        this.products.push(newProduct)
        console.log(`Producto '${title}' agregado correctamente con ID ${newId}.`);
    }        

    getProduct() {
        return this.products
    }
    getProductById(id){
        const product = this.products.find(product => product.id === id);
        
        !product ? console.log(`El ${id} no fue encontrado!`) : null;
        
        return product;
    }
    
}

const productManager = new ProductManager();

productManager.addProduct("Televisor HD","$50.000", "imagen.jpg", "001", 600)
productManager.addProduct("iphone 13", "El peor celular del mercado","$1.000.000", "imagen.jpg", "002", 0)
productManager.addProduct("Teclado razer blackwidow v2", "Teclado mecanico con switches blue","$90.000", "imagen.jpg", "003", 25)

const productIdToSearch = parseInt(prompt("Ingrese el ID del producto:"));

const foundProduct = productManager.getProductById(productIdToSearch);

console.log(foundProduct || `El siguiente id:${productIdToSearch} no fue encontrado.`);

