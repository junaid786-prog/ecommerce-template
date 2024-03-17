const crypto = require("crypto")
const ApikeyModel = require("../models/Apikey.model")
const APIError = require("../utility/ApiError")
const { apiKeyStatuses } = require("../utility/enums")
const CatchAsync = require("../utility/CatchAsync")

class ApiKey {
    // middelware functions
    /**
     * @description checks if api key is present in the request
     */
    static isApiKeyPresent(req, res, next) {
        let apiKey = new ApiKey().getApiKeyFromRequest(req)
        if (!apiKey) throw new APIError(401, "API key is required")
        next()
    }
    static isApiKeyValid = CatchAsync( async (req, res, next) => {
        let apiKeyFromRequest = new ApiKey().getApiKeyFromRequest(req)
        let apiKey = await ApikeyModel.checkApiKeyExists(apiKeyFromRequest)
        if (!apiKey) throw new APIError(401, "API key is invalid")
        next()
    })
    static async isApiKeyExpired(req, res, next) {
        let apiKey = new ApiKey().getApiKeyFromRequest(req)
        if (!apiKey) throw new APIError(401, "API key is required")
        const apiKeyData = await ApikeyModel.findOne({ apiKey})
        if (!apiKeyData) throw new APIError(401, "API key is invalid")
        if (apiKeyData.expirationTime < Date.now()) throw new APIError(401, "API key is expired")
        if (apiKeyData.status !== apiKeyStatuses[0]) throw new APIError(401, "API key is not active")
        next()
    }
    // 4. check if api key is active
    // 5. check if api key is banned
    // 6. check if api key is blocked
    // 7. rate limit the api key
    // 8. generate new api key


    // 9. get rate limit status
    // 10. update API key status
    // 11. get API key metadata
    // 12. validate request signature
    // 13. audit API key usage

    // helper functions


    // methods
    /**
     * @returns {string} api key | null
     */
    generateApiKey() {
        try {
            let key = crypto.randomBytes(10)
            key = key.toString("hex")
            return key
        } catch(err){
            return null
        }
    }
    /**
     * @returns {string} api key | null
     * @description gets api key from request
     */
    getApiKeyFromRequest(req) {
        let apiKey = req?.headers['x-api-key'] || req.headers.authorization || req.body.apiKey || req.query.apiKey
        return apiKey
    }
}

module.exports = ApiKey