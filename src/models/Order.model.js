const mongoose = require("mongoose");
const APIError = require("../utility/ApiError");
const ProductModel = require("./Product.model");
const { orderStatuses } = require("../utility/enums");

const OrderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "to place order customer is neccessary"]
    },
    products: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: [true, "to place order minimum one product is neccessary"]
            },
            quantity: {
                type: mongoose.Schema.Types.Number,
                default: 1,
                required: [true, "to place order minimum one product is neccessary"]
            }
        }
    ],
    deliveryDate: {
        type: mongoose.Schema.Types.Date,
        required: [true, "please enter day till which item will be delivered"]
    },
    startDate: {
        type: mongoose.Schema.Types.Date,
        default: Date.now()
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: [true, "enter price for order to be paid"]
    },
    status: {
        type: mongoose.Schema.Types.String,
        enum: orderStatuses,
        default: "created"
    }
})

OrderSchema.statics.findOrderById = async function (id) {
    let order = await this.findById(id)
    return order
}

OrderSchema.statics.validateOrder = async function (customerId, products, deliveryDate, price) {
    if (!customerId) throw new APIError(402, "customer id field can not be empty")
    else if (!products?.length) throw new APIError(402, "products field can not be empty")
    else if (!price) throw new APIError(402, "price field can not be empty")
    else if (price < 0) throw new APIError(402, "enter valid price")
    else if (!deliveryDate) throw new APIError(402, "date field can not be empty")
    for (let i = 0; i < products.length; i++) {
        let product = await ProductModel.getProduct(products[i]?.id)
        if (!product) throw new APIError(404, "product not found")
        if (products[i].quantity < 0 || (!products[i].quantity)) throw new APIError(402, "enter valid quantity")
        if (product.getStock() < products[i]?.quantity) throw new APIError(402, "not enough stock present for product " + product.name + " availabe quantity: " + product.stock)
    }
    return true
}

OrderSchema.statics.createOrder = async function (customerId, products, deliveryDate, price) {
    try {
        await this.create({
            customer: customerId,
            products,
            deliveryDate,
            price
        })
        for (let i = 0; i < products.length; i++) {
            await ProductModel.sellProduct(products[i]?.id, products[i]?.quantity)
        }
    } catch (err) {
        throw new APIError(402, err)
    }
}

OrderSchema.methods.updateStatus = async function (status) {
    try {
        this.status = status
        await this.save()
    } catch (err) {
        throw new APIError(402, err)
    }
}

OrderSchema.methods.getOrderStatus = async function () {
    return await this.status
}

OrderSchema.methods.deleteOrder = async function () {
    try {
        this.status = "cancelled"
        this.deliveryDate = Date.now()
        await this.save()
    } catch (err) {
        throw new APIError(402, err)
    }
}
module.exports = mongoose.model("order", OrderSchema)