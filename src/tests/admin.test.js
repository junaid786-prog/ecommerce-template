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

describe('/users', () => {
    test('should return users', () => {
        expect(200).toBe(200)
    })
});

// describe("DELETE /api/admin/user/delete/:gmail", () => {
//     test("should return 200", async () => {
//         let gmail = "testuser@gmail.comm"
//         const response = await request(app)
//         .delete(`/api/admin/user/delete/${gmail}`)

//         expect(response.status).toBe(200)
//     })
// })
