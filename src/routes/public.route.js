const PublicController = require("../controllers/public.controller")

const Router = require("express").Router()

Router.route("/products").get(PublicController.allProducts)

module.exports = Router
