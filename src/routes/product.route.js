const ProductController = require("../controllers/product.controller")
const Authorization = require("../middelwares/Authorization")

const Router = require("express").Router()

Router.route("/product/create").post(Authorization.isSeller, ProductController.createProduct)
Router.route("/product/update/stock").post(Authorization.isSeller, ProductController.updateProductStock)
Router.route("/product/delete").post(Authorization.isSeller, ProductController.deleteProduct)
Router.route("/my-products/:userid/products").get(ProductController.getMyProducts)
Router.route("/product/:id").get(ProductController.getSingleProduct)
// provide any discount 
// update product
// sell product

Router.route("/product/review").post(Authorization.isLoggedIn, ProductController.reviewProduct)
Router.route("/product/:id/reviews").get(ProductController.productReviews)
module.exports = Router

/* 
   1. get /products 
   2. post /products
   3. get /products/:id
   4. put /products/:id
   5. delete /products/:id

   1.a) /:userId/products
*/