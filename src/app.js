const path = require('path')
const express = require('express');
const session = require('express-session');
const cors = require("cors")
const publicRoutes = require("./routes/public.route")
const authRoutes = require("./routes/auth.route");
const adminRoutes = require("./routes/admin.route");
const orderRoutes = require("./routes/order.route");
const productRoutes = require("./routes/product.route");


const ErrorMidelware = require('./middelwares/ErrorMidelware');
const morgan = require("morgan");

require("dotenv").config()

const app = express();

app.use(express.json())
app.use(morgan("combined"))
app.use(session({
    cookie: {
        maxAge: 6 * 60 * 60 * 1000, // 1 hour
        sameSite: "none",
        httpOnly: true,
        secure: false // will be according to environment
    },
    saveUninitialized: true,
    unset: "keep",
    resave: true,
    secret: "mysecretkey" // from .env
}))
app.use(express.static(path.join(__dirname, "..", "public")))
app.all(/.*/, (request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,observe");
    response.setHeader("Access-Control-Max-Age", "3600");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Expose-Headers", "Authorization");
    response.setHeader("Access-Control-Expose-Headers", "responseType");
    response.setHeader("Access-Control-Expose-Headers", "observe");
    response.setHeader("X-Powered-By", "nginx:202");
    next()
})
app.use(session({
    cookie: {
        maxAge: 6 * 60 * 60 * 1000, // 1 hour
        // sameSite: "none",
        httpOnly: true,
       // secure: false // will be according to environment
    },
    saveUninitialized: true,
    unset: "keep",
    resave: true,
    secret: "mysecretkey" // from .env
}))
/* ROUTES */
app.use("/api", publicRoutes)
app.use("/api", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api", orderRoutes)
app.use("/api", productRoutes)

app.use(ErrorMidelware)
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})
module.exports = app;