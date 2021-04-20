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

// get route testing
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

// post route testing
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

// put route testing
describe("PUT /companies/:code", function () {
    test("update a company", async () => {
        const res = await request(app)
            .put("/companies/apple")
            .send({
                "code": "apple",
                "name": "Apple",
                "description": "You made a change"
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
                "code": "apple",
                "name": "Apple",
                "description": "You made a change"
            });
    })
})

// delete route testing
describe("DELETE /companies/:code", function () {
    test("update a company", async () => {
        const res = await request(app)
            .delete("/companies/apple");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({status: "DELETED"})
    });

});
