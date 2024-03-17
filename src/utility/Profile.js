class UserToStore {
    /**
     * @param {*} user - accepts a user from mongodb database
     */
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.gmail;
        this.role = user.userType;
    }
    /**
     * @param req accepts Express request object
     * @returns it saves user into req.session
     */
    saveUserToSession(req) {
        req.session.user = this;
    }
/**
     * @param req accepts Express request object
     * @returns it returns user from req.session
     */
    static getUserFromSession(req) {
        return req.session.user;
    }
    /**
     * @param req accepts Express request object
     * @returns it clears user from req.session
     * @static
     */
    static clearUserFromSession(req) {
        req.session.user = null;
        req.session.resetMaxAge(1000)
        req.session.destroy()
    }
}

module.exports = UserToStore;