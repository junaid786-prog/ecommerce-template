const mongoose = require("mongoose")
const ProductModel = require("./Product.model")
const APIError = require("../utility/ApiError")
const { ObjectId, String, Number } = mongoose.Schema.Types

const ReviewSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "product",
        required: [true, "product to be reviewed is neccessary"],
    },
    customer: {
        type: ObjectId,
        ref: "user",
        required: [true, "customer id who is reviewing is must"]
    },
    review: {
        type: String,
        required: [true, "please write review to post"]
    },
    postedAt: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 5,
        required: [true, "rating is must for product"]
    }
})
ReviewSchema.statics.findReviewById = async function (id) {
    let review = await this.findById(id)
    return review
}

ReviewSchema.statics.validateReview = async function (customerId, productId, rating, review) {
    if (!customerId) throw new APIError(402, "customer id field can not be empty")
    else if (!productId) throw new APIError(402, "product field can not be empty")
    else if (!rating) throw new APIError(402, "rating field can not be empty")
    else if (rating < 0 || rating > 5) throw new APIError(402, "enter valid rating (0 - 5)")
    else if (!review) throw new APIError(402, "review field can not be empty")
    return true
}

ReviewSchema.statics.createReview = async function (customerId, productId, rating, review) {
    try {
        await this.create({
            customer: customerId,
            product: productId,
            rating,
            review
        })
    } catch (err) {
        throw new APIError(402, err)
    }
}

// delete review 
// update review 

ReviewSchema.statics.getReviews = async function (productId) {
    try {
        let reviews = await this.find({
            product: productId
        })

        return reviews
    } catch (err) {
        throw new APIError(402, "enter valid product id")
    }
}
module.exports = new mongoose.model("review", ReviewSchema)