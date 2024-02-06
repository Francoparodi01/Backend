const mongoose = require("mongoose")

const productsSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    title:{ 
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    description:  {
        type: String,
        required: true
    },
    code:{
        type: Number,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    status:{
        type: Boolean,
        required: true
    },
    category:{
        type: String,
        required: true
    },
});

//Defino modelo

const ProductModel = mongoose.model("products", productsSchema);

//Exporto modelo

module.exports = ProductModel;