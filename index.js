const app = require('./src/app');
const Database = require('./src/utility/Database');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    app.listen(PORT, listenServer)
    await Database.connectDB()
}
const listenServer = (err) => {
    if (err){
        console.log(err)
    }
    else console.log(`app is running on port ${PORT}`)
}

startServer()