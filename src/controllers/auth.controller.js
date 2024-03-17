const ApiKey = require("../middelwares/Apikey")
const UserModel = require("../models/User.model")
const APIError = require("../utility/ApiError")
const CatchAsync = require("../utility/CatchAsync")
const UserToStore = require("../utility/Profile")

class AuthController {
    static register = CatchAsync(async (req, res) => {
        let { name, gmail, password, country } = req.body

        const apiKey = req.query.apiKey || req.headers['x-api-key'];

        if (!apiKey) {
            throw new APIError(401, "API key is required")
        }
        let alreadyExists = await UserModel.checkUserExists(gmail, apiKey)
        if (alreadyExists) throw new APIError(403, "User with this gmail already exists")

        let validUser = UserModel.validateUser(name, gmail, password, country)
        if (validUser) {
            let user = await UserModel.createUser(name, gmail, password, country, apiKey)
            let userToStore = new UserToStore(user)
            userToStore.saveUserToSession(req)
            res.status(201).json({
                success: true,
                user: user,
                message: "User is successfully created"
            })
        } else {
            throw new APIError(402, "Validation error")
        }
        // let user = await UserModel.checkUserExists(gmail)
        // if (user !== null) {
        //     let userToStore = new UserToStore(user)
        //     userToStore.saveUserToSession(req)
        // }
        // send verification email
        
    })
    static login = CatchAsync(async (req, res) => {
        let { gmail, password } = req.body
        if (!gmail || !password) throw new APIError(402, "gmail and password fields can not be empty")

        let apiKey = new ApiKey().getApiKeyFromRequest(req)

        let user = await UserModel.checkUserExists(gmail, apiKey)
        if (!user) throw new APIError(404, "Invalid gmail or password")
        // de hash password and compare with db
        if (!user.comparePasswords(password)) throw new APIError(404, "Invalid gmail or password")
        // save user to request
        let userToStore = new UserToStore(user)
        userToStore.saveUserToSession(req)

        res.status(200).json({
            success: true,
            user: user,
            message: "User successfully logged in"
        })
    })
    static logout = CatchAsync(async (req, res) => {
        if (!UserToStore.getUserFromSession(req)) throw new APIError(401, "login first to access this")
        UserToStore.clearUserFromSession(req)
        res.status(200).json({
            success: true,
            message: "User logged out"
        })
    })
    static getProfile = CatchAsync(async (req, res) => {
        let apiKey = new ApiKey().getApiKeyFromRequest(req)
        if (!UserToStore.getUserFromSession(req)) {
            throw new APIError(401, "login first to access this")
        }
        let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email, apiKey)
        res.status(200).json({
            success: true,
            message: `${user?.name} is successfully logged in`,
            user: user
        })
    })
    static changeModeToSeller = CatchAsync(async (req, res) => {
        let { email } = UserToStore?.getUserFromSession(req)
        await UserModel.changeModeToSeller(email)
        res.status(200).json({
            success: true,
            message: "User mode changed to seller"
        })
    })
    // send verification email
    // verify email
    // send reset password email
    // reset password
    // change password
    // update profile
}

module.exports = AuthController