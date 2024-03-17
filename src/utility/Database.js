const { default: mongoose } = require("mongoose")

class Database {
    static connectDB = async ()=>{
        try{
            await mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            console.log("DB CONNECTED!")
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = Database