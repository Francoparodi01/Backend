const socket = io();

socket.on("productos", (products) => {
    renderProducts(products);
});

document.getElementById("contenedorProductos").addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("delete-button")) {
        const productId = target.getAttribute("data-id");
        eliminarProducto(productId);
    }
});

const renderProducts = (products) => {
    const productsContainer = document.getElementById("contenedorProductos");
    productsContainer.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <p>Id ${product.id} </p>
            <p>Titulo ${product.title} </p>
            <p>Precio ${product.price} </p>
            <img src="${product.thumbnails}" alt="${product.title}" class="product-img">
            <button class="delete-button" data-id="${product.id}">Eliminar Producto</button>
        `;

        productsContainer.appendChild(card);
    });
}

const eliminarProducto = (id) => {
    socket.emit("deleteProduct", id);
}

document.getElementById("send-button").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const productAdded = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };

    socket.emit("addProduct", productAdded);
    console.log(productAdded);
};
