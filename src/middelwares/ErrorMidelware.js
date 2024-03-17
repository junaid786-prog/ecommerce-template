module.exports = (err, req, res, next)=>{
    let message = err.message || "Internal server error"
    let status = err.status || 500

    res.status(status).json({
        success: false,
        message,
        stack: err.stack
    })
}