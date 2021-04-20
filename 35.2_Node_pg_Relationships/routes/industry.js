const db = require('../db');
const slugify = ('slugify');
const express = require('express');
const app = require('../app');
const ExpressError = require('../expressError');
const router = express.Router();


router.get("/", async (req, res, next) => {
    try {
        let results = await db.query(
            `SELECT * FROM industries;`
        )
        return res.json(results.rows)
    } catch (e) {
        next(e)
    }
})

router.get("/:code", async (req, res, next) => {
    try {
        let { code } = req.params
        let result = await db.query(
            `SELECT i.industry, c.name
            FROM companies AS c
            JOIN companies_industries as ci
            ON ci.c_code = c.code 
            LEFT JOIN industries as i
            ON i.code = ci.i_code
            WHERE i.code =$1;`, [code]
        )
        return res.json(result.rows)
    } catch (e) {
        next(e)
    }
})
router.post("/", async (req, res, next) => {
    try {
        let {code, industry} = req.body
        let results = await db.query(
            `INSERT INTO industries (code, industry)
            VALUES ($1, $2)
            RETURNING code, industry`, [code, industry]);
        return res.json(results.rows[0]);
    } catch (e) {
        return next(e)
    }
})


module.exports = router;