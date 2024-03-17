const ProductModel = require("../models/Product.model")
const CatchAsync = require("../utility/CatchAsync")
class PublicController{
    static allProducts = CatchAsync(async (req, res)=>{
        let products = await ProductModel.aggregate([{$lookup: {
            from: "users",
            localField: "seller",
            foreignField: "_id",
            as: "seller"
        }}]).limit(10)
        res.status(200).json({
            success: true,
            products: products
        })
    })
}

module.exports = PublicController