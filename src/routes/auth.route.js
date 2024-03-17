const AuthController = require("../controllers/auth.controller")
const ApiKey = require("../middelwares/Apikey")
const { isLoggedIn } = require("../middelwares/Authorization")

const Router   = require("express").Router()

Router.route("/register").post(ApiKey.isApiKeyPresent, ApiKey.isApiKeyValid, AuthController.register)
Router.route("/login").post(ApiKey.isApiKeyPresent, ApiKey.isApiKeyValid, AuthController.login)
Router.route("/logout").get(ApiKey.isApiKeyPresent, ApiKey.isApiKeyValid, AuthController.logout)
Router.route("/user").get(ApiKey.isApiKeyPresent, ApiKey.isApiKeyValid, AuthController.getProfile)
Router.route("/user/change/role").put(ApiKey.isApiKeyPresent, ApiKey.isApiKeyValid, isLoggedIn, AuthController.changeModeToSeller)
module.exports = Router

// TODOs

// verify gmail (RabitMQ)
// forget password
// change password
// update profile