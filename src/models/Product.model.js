const mongoose = require("mongoose")
const APIError = require("../utility/ApiError")

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name field can not be empty"],
        maxLength: [200, "product name must be less than 200 chars"]
    },
    description: {
        type: String,
        required: [true, "description field can not be empty"],
        maxLength: [400, "product description must be less than 400 chars"]
    },
    price: {
        type: Number,
        required: [true, "price field can not be empty"],
        min: [1, "product price must be between 1 to 100000"],
        max: [100000, "product price must be between 1 to 100000"]
    },
    images: [{
        type: String,
        required: ["true", "image url can  not be empty"]
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "seller of product can not be empty"],
        ref: "user"
    },
    stock: {
        type: Number,
        default: 1,
    }
    // category
})

Product.methods.getStock = async function () {
    return this.stock
}
Product.statics.updateStock = async function (id, newStock) {
    let product = await this.findById(id)
    product.stock = product.stock + newStock
    await product.save()
}
Product.statics.validateProduct = function (name, description, price, stock) {
    if (!name) throw new APIError(401, "name field can not be empty")
    else if (!description) throw new APIError(401, "description field can not be empty")
    else if (!price) throw new APIError(401, "price field can not be empty")
    else if (price < 0) throw new APIError(401, "enter valid price")
    else if (!stock) throw new APIError(401, "stock field can not be empty")
    else if (stock < 0) throw new APIError(401, "enter valid quantity")
    else return true
}
Product.statics.getProduct = async function (id) {
    let product = await this.findById(id)
    if (!product) throw new APIError(404, "product not found")
    return product;
}
Product.statics.deleteProduct = async function (id) {
    await this.deleteOne({ _id: id })
    return true
}
Product.statics.createProduct = async function (name, description, url, price, stock, sellerId, apiKey) {
    try {
        await this.create({
            name,
            description,
            price,
            stock,
            images: url,
            seller: sellerId,
            apiKey
        })
    } catch (err) {
        throw new APIError(402, err)
    }
}
Product.statics.sellProduct = async function (productId, quantity) {
    let product = await this.findById(productId)
    if (!product) throw new APIError(404, "product not found")
    
    if (product.stock < quantity || quantity < 0){
        throw new APIError(402, `enter valid quantity available stock for ${product.name} is ${product.stock}` )
    }

    product.stock -= quantity
    await product.save()
    return true

}
module.exports = mongoose.model("product", Product)