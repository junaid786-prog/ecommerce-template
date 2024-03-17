const OrderController = require("../controllers/order.controller")
const Authorization = require("../middelwares/Authorization")

const Router = require("express").Router()

Router.route("/orders").get(Authorization.isLoggedIn, OrderController.getMyOrders)
Router.route("/order/create").post(Authorization.isLoggedIn,OrderController.placeOrder)
Router.route("/order/cancel").post(Authorization.isLoggedIn, OrderController.cancelOrder)
Router.route("/order-status/:id").post(Authorization.isLoggedIn, OrderController.trackOrder)

module.exports = Router