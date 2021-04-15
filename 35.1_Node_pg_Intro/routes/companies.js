const db = require('../db');
const express = require('express');
const app = require('../app');
const ExpressError = require('../expressError');
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT * FROM companies`
        );
        return res.json({companies: results.rows});
    } catch (e) {
        return next(e)
    }
})

router.get("/:code", async (req, res, next) => {
    try {
        const code = req.params.code;
        const results = await db.query(
            `SELECT code, name, description FROM companies WHERE code = $1`, [code]);
        if (results.rows.length === 0) {
            throw new ExpressError("No such company exists", 404)
        }
        return res.json({ company: results.rows[0] });
    } catch (e) {
        return next(e['message'])
    }
})


module.exports = router;