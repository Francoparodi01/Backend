class ProductManager {
    constructor(){
        this.products = []
        //utilizo console.log
        console.log(this.products)
    }
     
    addProduct(title, description, price, thumbnail, code, stock) {
        // Validamos que TODOS los campos sean obligatorios. En caso de no serlo, se retorna un console.log
        if (![title, description, price, thumbnail, code, stock].every(Boolean)) {
            console.log("Todos los campos son obligatorios.");
            return;
        }
        // En este caso validamos que TODOS los codigos "code" sean distintos. En caso de no serlo, se retorna un console.log
            if (this.products.some(product => product.code === code)) {
                console.log(`Ya existe un producto con el código ${code}.`);
                return;
            }
            
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

    getProducts() {
        console.log(this.products);
    }

    // funcion que recorre el array con el metodo .find y verifica si el ID se encuentra o no dentro de los objetos del array
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.log(`El ${id} no fue encontrado!`);
        }  
        return product;
    }

    
}
// Para llamar a una funcion que está dentro de productManager, este mismo lo debemos agregarlo antes de llamar a cada funcion ya que las funciones dentro de la clase
// tienen un alcance local y no global

// Llamando a un new ProductManager creamos una nueva instancia de la clase ProductManager, asi pudiendo agregar todos los productos con sus respectivas características. 
//nombre, descripcion, precio, etc

const productManager = new ProductManager();

productManager.addProduct("Televisor HD", "televisor 60 pulgadas full hd","$50.000", "imagen.jpg", "001", 600)
productManager.addProduct("iphone 13", "El peor celular del mercado","$1.000.000", "imagen.jpg", "002", 3)
productManager.addProduct("Teclado razer blackwidow v2", "Teclado mecanico con switches blue","$90.000", "imagen.jpg", "003", 25)

const productIdToSearch = parseInt(prompt("Ingrese el ID del producto:"));

// ingresamos a productManager => buscamos la funcion getProductById y le pasamos por parametro la variable anterior. La idea es que el usuario ingrese un numero y la funcion
// recorra el array de objetos buscando el id ingresado. Si es verdadero, se devuelve el producto con el id ingresado, sino, se devuelve un console.log indicando que no se encontro tal id
const foundProduct = productManager.getProductById(productIdToSearch);

console.log(foundProduct || `El siguiente id:${productIdToSearch} no fue encontrado.`);

productManager.getProducts();
