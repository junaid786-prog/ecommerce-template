// api key mongoose model with fields api key and user id , requests made, last request time, and api key creation time, and api key expiration time, and api key status
const mongoose = require("mongoose")
const { apiKeyStatuses } = require("../utility/enums")
const APIError = require("../utility/ApiError")

const ApiKey = new mongoose.Schema({
    apiKey: {
        type: String,
        required: [true, "Please enter api key"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: [true, "Please enter user id"]
    },
    requestsMade: {
        type: Number,
        default: 0
    },
    lastRequestTime: {
        type: Date,
        default: Date.now()
    },
    creationTime: {
        type: Date,
        default: Date.now()
    },
    expirationTime: {
        type: Date,
        default: Date.now() + 1000 * 60 * 60 * 24 * 30
    },
    status: {
        type: String,
        enum: apiKeyStatuses,
        default: "active"
    }
})
ApiKey.statics.createApiKey = async function (apiKey, userId) {
    try {
        let key = await this.create({ apiKey, userId })
        return key
    } catch (err) {
        throw new APIError(402, err)
    }
}
ApiKey.statics.checkApiKeyExists = async function (apiKey) {
    try {
        let key = await this.findOne({ apiKey })
        return key
    }
    catch (err) {
        return null
    }
}
module.exports = mongoose.model("apikeys", ApiKey)