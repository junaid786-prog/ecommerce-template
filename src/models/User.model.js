const { default: mongoose } = require("mongoose")
const bcrypt = require("bcryptjs")
const APIError = require("../utility/ApiError")
const { userRoleTypes } = require("../utility/enums")

const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        minLength: [2, "Name must be between 2 to 20 chars"],
        maxLength: [20, "Name must be between 2 to 20 chars"]
    },
    gmail: {
        type: String,
        required: [true, "Please enter gmail"],
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    country: {
        type: String,
        required: [true, "Please enter country name"]
    },
    userType: {
        type: String,
        enum: userRoleTypes,
        default: "buyer"
    },
    apiKey: {
        type: String,
        required: [true, "Please enter api key"]
    }
})

User.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
  })
  
User.methods.comparePasswords = async function (password){
    let a = await bcrypt.compare(password, this.password)
    return a
}
User.statics.validateUser = function (name, gmail, password, country){
    if (!name) throw new APIError(401, "name field can not be empty")
    else if (!gmail) throw new APIError(401, "gmail field can not be empty")
    else if (!password) throw new APIError(401, "password field can not be empty")
    else if (!country) throw new APIError(401, "country field can not be empty")
    else return true
}
User.statics.checkUserExists = async function (gmail, apiKey){
    if (!gmail) throw new APIError(401, "gmail field can not be empty")
    let user = await this.findOne({gmail, apiKey})
    return user;
}
User.statics.findUserById = async function (id){
    if (!id) throw new APIError(401, "user id field can not be empty")
    let user = await this.findById(id)
    if (!user) throw new APIError(404, "user is not present with this id")
    return user;
}
User.statics.deleteUser = async function (gmail, apiKey){
    if (!gmail) throw new APIError(401, "gmail field can not be empty")
    let user = await this.findOne({gmail, apiKey})
    if (!user) throw new APIError(404, "user not found with this gmail")
    await this.deleteOne({gmail: gmail, apiKey: apiKey})
    return true
}
User.statics.createUser = async function (name, gmail, password, country, apiKey){
    console.log(apiKey + ": key")
    try{
        let user = await this.create({
            name,
            gmail,
            password,
            country,
            apiKey
        })
        return user
    } catch(err){
        throw new APIError(402, err)
    }
}
// update user type to seller
User.statics.changeModeToSeller = async function (gmail){
    if (!gmail) throw new APIError(401, "gmail field can not be empty")
    let user = await this.checkUserExists(gmail)
    if (!user) throw new APIError(404, "user not found with this gmail")
    user.userType = "seller"
    await user.save()
    return true
}
module.exports = mongoose.model("user", User)