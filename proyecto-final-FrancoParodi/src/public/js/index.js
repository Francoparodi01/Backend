const socket = io();

socket.on("productos", (products) => {
    renderProducts(products);
}); 

const renderProducts = (products) => {
    const productsContainer = document.getElementById("contenedorProductos");
    productsContainer.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card");
        //Agregamos boton para eliminar: 
        card.innerHTML = `
                <p>Id ${product.id} </p>
                <p>Titulo ${product.title} </p>
                <p>Precio ${product.price} </p>
                <button> Eliminar Producto </button>
        `;
        productsContainer.appendChild(card);

        //Agregamos el evento eliminar producto:
        card.querySelector("button").addEventListener("click", () => {
            deleteProducts(product.id);
        });
    });
}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
}

//Agregar producto:

document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const productAdded = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value, // Fix: Use correct ID "img"
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true" // Convert status to boolean
    };

    socket.emit("addProduct", productAdded);
    console.log(productAdded)
};