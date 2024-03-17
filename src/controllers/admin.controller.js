const OrderModel = require("../models/Order.model");
const {LOG} = require("custom-logger-express");
const ProductModel = require("../models/Product.model");
const UserModel = require("../models/User.model");
const APIError = require("../utility/ApiError");
const CatchAsync = require("../utility/CatchAsync");

class AdminContoller {
    // 1. see all users with that api key
    static getAllUsers = CatchAsync(async (req, res) => {
        let allUsers = await UserModel.find().limit(10);
        LOG.e("All users are fetched")
        res.status(200).json({
            success: true,
            users: allUsers
        })
    })
    // 2. see all orders with that api key
    static getAllOrders = CatchAsync(async (req, res) => {
        let allOrders = await OrderModel.find().limit(10)

        res.status(200).json({
            success: true,
            orders: allOrders
        })
    })
    // 3. see all products - - - - -
    static getAllProducts = CatchAsync (async (req, res) => {
        let allProducts = await ProductModel.find().limit(10)

        res.status(200).json({
            success: true,
            products: allProducts
        })
    })
    // 4. delete any product - - - -
    // 5. delete any user - - - - -
    // >> subsequent products will be deleted
    // >> product will be removed from orders
    // >> subsequent order will be deleted
    // 4,5 >> warn any user
    static deleteUser = CatchAsync(async (req, res) => {
        let { gmail } = req.params
        if (!gmail) throw new APIError(402, "Enter gmail to delete specific user")

        let apiKey = req.headers.authorization || req.body.apiKey || req.query.apiKey
        if (!apiKey) throw new APIError(401, "API key is required")
        
        let ok = await UserModel.deleteUser(gmail, )
        if (!ok) res.status(400).json({
            success: false,
            message: "error while deleting user"
        })
        res.status(200).json({
            success: true,
            message: "user is successfully deleted"
        })
    })
}

module.exports = AdminContoller