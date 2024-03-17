const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")

require("dotenv").config()

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL)
})
afterAll(async () => {
    await mongoose.connection.close()
})

describe('POST /register', () => {
    test('should respond with 201', async () => {
        let user = {
            gmail: "testuser@gmail.comm",
            password: "123456",
            name: "junaid",
            country: "pakistan"
        }
        const response = await request(app)
            .post("/api/register")
            .send(user)
        expect(response.status).toBe(201)
    })
    test('should respond with 403', async () => {
        let user = {
            gmail: "testuser@gmail.comm",
            password: "123456",
            name: "junaid",
            country: "pakistan"
        }
        const response = await request(app)
            .post("/api/register")
            .send(user)
        expect(response.status).toBe(403)
    })
});
describe("DELETE /api/admin/user/delete/:gmail", () => {
    test("should return 200", async () => {
        let gmail = "testuser@gmail.comm"
        const response = await request(app)
            .delete(`/api/admin/user/delete/${gmail}`)

        expect(response.status).toBe(200)
    })
})
describe('POST /login', () => {
    test('should respond with 200', async () => {
        let user = {
            gmail: "testuser@gmail.com",
            password: "123456"
        }
        const response = await request(app)
            .post("/api/login")
            .send(user)
        expect(response.status).toBe(200)
    })
    // with empty field = 402
    test("should reapond with 402 - bad request - empty field", async () => {
        let user = {
            password: "12334"
        }

        let response = await request(app)
            .post("/api/login")
            .send(user)

        expect(response.status).toBe(402)
    })
    // with incorrect field = 404
    test("should respond with 404 - user not found", async () => {
        let user = {
            gmail: "user12345678@gmail.com",
            password: "12334"
        }

        let response = await request(app)
            .post("/api/login")
            .send(user)

        expect(response.status).toBe(404)
    })
});

// describe('GET /logout', () => {
//     test('should respond with 401 - log in first', async () => {
//         // let user = {
//         //     gmail: "testuser@gmail.com",
//         //     password: "123456"
//         // }
//         // await request(app)
//         // .post("/api/login")
//         // .send(user)

//         const response = await request(app)
//             .get('/api/logout')

//         expect(response.status).toBe(401)
//     })
// })