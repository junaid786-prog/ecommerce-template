const OrderModel = require("../models/Order.model");
const ProductModel = require("../models/Product.model");
const APIError = require("../utility/ApiError");
const CatchAsync = require("../utility/CatchAsync");
const UserToStore = require("../utility/Profile");

class OrderController {
    // place order
    static placeOrder = CatchAsync(async (req, res) => {
        const customer = UserToStore.getUserFromSession(req)
        if (!customer) throw new APIError(402, "login first to place order")
        const { products, deliveryDate, price } = req.body
        await OrderModel.validateOrder(customer.id, products, deliveryDate, price)
        await OrderModel.createOrder(customer.id, products, deliveryDate, price)
        // make total of all products
        // receive payment for order
        // if success sell these
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            await ProductModel.sellProduct(product.id, product.quantity)
        }
        res.status(201).json({
            success: true,
            message: "Order is placed successfully"
        })
    })
    // track order
    static trackOrder = CatchAsync(async (req, res) => {
        let { orderId } = req.params.id
        if (!orderId) throw new APIError(402, "please enter an order id")

        let specificOrder = await OrderModel.findOrderById(orderId)
        if (!specificOrder) throw new APIError(404, "no order found with this id")

        let orderStatus = await specificOrder.getOrderStatus()

        res.status(200).json({
            success: true,
            status: orderStatus
        })
    })
    // cancel order
    static cancelOrder = CatchAsync(async (req, res) => {

        let { orderId } = req.body
        if (!orderId) throw new APIError(402, "please enter an order id")

        let specificOrder = await OrderModel.findOrderById(orderId)
        if (!specificOrder) throw new APIError(404, "no order found with this id")

        // update products quantity
        for (let i = 0; i < specificOrder.products.length; i++) {
            let product = specificOrder.products[i]
            await product.updateStock(product.quantity)
        }
        await specificOrder.deleteOrder()
        // return payment into customer account
        res.status(200).json({
            success: true,
            message: "order is cancelled successfully"
        })
    })
    // get my orders
    static getMyOrders = CatchAsync(async (req, res) => {
        // get user from session
        let customerID = UserToStore.getUserFromSession(req)?.id
        let myOrders = await OrderModel.find({
            customer: customerID
        })
        // get orders with field customer = user
        res.status(200).json({
            success: true,
            orders: myOrders
        })
    })
    // get all orders
}

module.exports = OrderController