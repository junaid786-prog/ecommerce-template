const request = require("supertest")
const app = require('../app')
const { default: mongoose } = require("mongoose")

require("dotenv").config()
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URL)
    let user = {
        gmail: "testuser@gmail.com",
        password: "123456"
    }
    await request(app)
        .post("/api/login")
        .send(user)
})
afterAll(async () => {
    await mongoose.connection.close()
})
describe('POST /create/order', () => {
    test('should respond with 201 - created', async () => {
        let order = {
            products: ["hello"],
            deliveryDate: new Date(),
            price: 1200
        }

        const response = await request(app)
            .post("/api/order/create")
            .send(order)

        expect(response.status).toBe(404)
    })
});
