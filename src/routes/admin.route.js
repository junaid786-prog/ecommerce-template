const AdminContoller = require("../controllers/admin.controller")
const Authorization = require("../middelwares/Authorization")

const Router   = require("express").Router()

// 1. see all users with that api key
Router.route("/products").get(Authorization.isLoggedIn, Authorization.isAdmin, AdminContoller.getAllProducts)
Router.route("/orders").get(Authorization.isLoggedIn, Authorization.isAdmin, AdminContoller.getAllOrders)
Router.route("/users").get(Authorization.isLoggedIn, Authorization.isAdmin, AdminContoller.getAllUsers)
// 2. see all orders with that api key
// 3. see all products - - - - -
// 4. delete any product - - - -
// 5. delete any user - - - - -
// -> subsequent products will be deleted
// -> product will be removed from orders
// -> subsequent order will be deleted
Router.route("/user/delete/:gmail").delete(Authorization.isAdmin, AdminContoller.deleteUser)

module.exports = Router