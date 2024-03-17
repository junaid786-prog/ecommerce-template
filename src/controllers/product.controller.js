const ApiKey = require("../middelwares/Apikey");
const ProductModel = require("../models/Product.model");
const ReviewModel = require("../models/Review.model");
const APIError = require("../utility/ApiError");
const CatchAsync = require("../utility/CatchAsync");
const UserToStore = require("../utility/Profile");

class ProductController {
    // add product
    static createProduct = CatchAsync(async (req, res)=>{
        let apiKey = new ApiKey().getApiKeyFromRequest(req)
        if (!apiKey) throw new APIError(401, "API key is required")
        
        let {name, description, price, url, stock} = req.body
        let validProduct = ProductModel.validateProduct(name, description, price, stock)
        if (!validProduct) throw new APIError(402, "enter valid product")
        let seller = UserToStore.getUserFromSession(req).id
        await ProductModel.createProduct(name, description, url, price, stock, seller)

        res.status(201).json({
            success: true,
            message: "product is successfully created"
        })
    })
    // get my products
    static getMyProducts = CatchAsync(async (req, res)=>{
        let products = await ProductModel.find({
            seller: req.user.id
        })
        // apply other things like limit, pagination
        res.status(200).json({
            success: true,
            products
        })
    })
    static getSingleProduct = CatchAsync(async (req, res) => {
        const { id } = req.params
        if (!id) throw new APIError("product not found")
        let product = await ProductModel.getProduct(id)

        res.status(200).json({
            success: true,
            product: product
        })
    })
    // update product qty
    static updateProductStock = CatchAsync(async (req, res)=>{
        let { productId, stock } = req.body
        if (!productId) throw new APIError(401, "enter product id you want to update")
        if (!stock || stock < 0) throw new APIError(401, "enter valid quantity of product")
        let targetProduct = await ProductModel.getProduct(productId)
        if (!targetProduct) throw new APIError(404, "no product found with this id")

        targetProduct.stock = stock
        await targetProduct.save()

        res.status(201).json({
            success: true,
            message: "stock of product is successfully updated"
        })
    })
    // delete product
    static deleteProduct = CatchAsync(async (req, res)=>{
        let {productId} = req.body
        if(!productId) throw new APIError(404, "enter product id you want to delete")
        let targetProduct = await ProductModel.getProduct(productId)
        if (!targetProduct) throw new APIError(404, "no product found with this id")

        ProductModel.deleteProduct(productId)

        res.status(200).json({
            success: true,
            message: "product is deleted successfully"
        })
    })
    // sell product
    static sellProduct = CatchAsync(async(req, res)=>{
        const {productId, quantity} = req.body
        let result = await ProductModel.sellProduct(productId, quantity)
        if (!result) throw new APIError(402, "you can nto sell this product")
        
        res.status(200).json({
            success: true
        })
    })

    // provide any discount
    // get related products

    static reviewProduct = CatchAsync(async (req, res) => {
        const {customerId, productId, rating, review} = req.body
        // if already reviewed product then replace it/update
        await ReviewModel.validateReview(customerId, productId, rating, review)
        await ReviewModel.createReview(customerId, productId, rating, review)

        res.status(201).json({
            success: true,
            message: "review is successfully created"
        })
    })
    static productReviews = CatchAsync(async (req, res) => {
        const {id} = req.params
        if (!id) throw new APIError("enter product id")

        let reviews = await ReviewModel.getReviews(id)

        res.status(201).json({
            success: true,
            reviews
        })
    })
}

module.exports = ProductController