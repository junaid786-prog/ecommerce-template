const UserModel = require("../models/User.model");
const APIError = require("../utility/ApiError");
const CatchAsync = require("../utility/CatchAsync");
const UserToStore = require("../utility/Profile");

class Authorization {
    static isLoggedIn = CatchAsync(async(req, res, next)=>{
        let userId = UserToStore.getUserFromSession(req)?.id
        if (!userId) throw new APIError(401, "login first to access this")
        let user = await UserModel.findUserById(userId)
        if (!user) throw new APIError(404, "user not found with this id")
        return next()
    })

    static isSeller = CatchAsync(async(req, res, next)=>{
        let userId = UserToStore.getUserFromSession(req)?.id
        if (!userId) throw new APIError(401, "login first to access this")
        // let user = await UserModel.findUserById(userId)
        // if (!user) throw new APIError(404, "user not found with this id")
        let user = UserToStore.getUserFromSession(req)
        if (user.role !== "seller") throw new APIError(401, "you are not seller. register as seller first")
        return next()
    })

    static isAdmin = CatchAsync(async(req, res, next)=>{
        let userId = UserToStore.getUserFromSession(req)?.id
        if (!userId) throw new APIError(401, "login first to access this")
        let user = await UserModel.findUserById(userId)
        if (!user) throw new APIError(404, "user not found with this id")

        if (user.userType !== "admin") throw new APIError(401, "you are not admin.")
        next()
    })
}

module.exports = Authorization