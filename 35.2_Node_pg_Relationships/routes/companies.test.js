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

describe("GET /companies", () => {
    test("get all company", async () => {
        const res = await request(app).get("/companies");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "companies": [
                {
                    "code": "apple",
                    "name": "Apple",
                    "description": "Maker of OSX."
                },
                {
                    "code": "ibm",
                    "name": "IBM",
                    "description": "Big blue."
                }
            ]
        });
    });
});

describe("POST /companies", () => {
    test("test post route", async () => {
        const res = await request(app)
            .post("/companies")
            .send({
                "code": "instagram",
                "name": "Instagram",
                "description": "You post pictures here"
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
  "code": "instagram",
  "name": "Instagram",
  "description": "You post pictures here"
});
    })
})
