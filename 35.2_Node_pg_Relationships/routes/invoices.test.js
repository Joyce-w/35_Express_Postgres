process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const {createData} = require("../fakeDB")

// add test before each test
beforeEach(createData);

afterAll(async () => {
  await db.end()
})


describe("/GET /invoices", function () {
    test("Respond with all invoices", async () => {
        const res = await request(app).get("/invoices");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toEqual(3);
    });
})

describe("/POST /invoices", function () {
    test("test posting a new invoice", async () => {
        const res = await request(app)
        .post("/invoices")
        .send({
            "comp_code": "apple",
            "amt": 9876,
            "paid": false,
            "add_date": "2021-03-20",
            "paid_date": "2021-04-20"
        });
        expect(res.statusCode).toBe(200)
        expect(res.body.invoice['amt']).toEqual(9876)
    })
})


describe("DELETE /invoice/:code", function () {
    test("delete route", async () => {
        const res = await request(app).delete("/invoices/1")
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({status: "deleted"});
    })
})
