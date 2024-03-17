const mongoose = require("mongoose")
const { apiKeyStatuses } = require("../utility/enums")
const Customer = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        minLength: [2, "Name must be between 2 to 20 chars"],
        maxLength: [20, "Name must be between 2 to 20 chars"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    phone: {
        type: String,
        required: [true, "Please enter phone number"]
    },
    address: {
        type: String,
        required: [true, "Please enter address"]
    },
    status: {
        type: String,
        enum: apiKeyStatuses,
        default: "active"
    },
    creationTime: {
        type: Date,
        default: Date.now()
    },
    lastUpdateTime: {
        type: Date,
        default: Date.now()
    },
    apiKey: {
        type: String,
        required: [true, "Please enter api key"]
    }
})

module.exports = mongoose.model("customer", Customer)
