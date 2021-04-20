const db = require('../db');
const slugify = ('slugify');
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
            `SELECT c.code, c.name, c.description, i.industry
            FROM companies AS c
            JOIN companies_industries as ci
            ON ci.c_code = c.code 
            LEFT JOIN industries as i
            ON i.code = ci.i_code
            WHERE c.code = $1`,
            [code]);
        
        const invoice = await db.query(
            `SELECT id, comp_code, amt, paid, add_date FROM invoices 
            JOIN companies on companies.code = invoices.comp_code
            WHERE comp_code=$1`,
            [code]);
        if (results.rows.length === 0) {
            throw new ExpressError("No such company exists", 404)
        }
        return res.json({ company: results.rows[0], invoices: invoice.rows });
    } catch (e) {
        return next(e['message'])
    }
})

router.post("/", async (req, res, next) => {
    try {
        let { code, name, description } = req.body;
        let results = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json(results.rows[0])        
    } catch (e) {
        next(e)
    }
})

router.put("/:code", async function (req, res, next) {
    try {
        let { name, description } = req.body;
        let code = slugify(req.params.code);
        
        const result = await db.query(
          `UPDATE companies
           SET name=$1, description=$2
           WHERE code = $3
           RETURNING code, name, description`,
        [name, description, code]);
        
        if (result.rows.length === 0) {
            throw new ExpressError("No such company code", 404)
        } else {
        return res.json(result.rows[0])            
        }
    } catch (e) {
        next(e)
    }
})

router.delete("/:code", async (req, res, next) => {
    try {
        const code = req.params.code;
        let result = db.query(
            'DELETE FROM companies WHERE code = $1', [code])
            console.log(result.rows)
        if (result.length === 0) {
            throw new ExpressError("No such company code", 404)
        } else {
        return res.send({ status: "DELETED" })          
        }                
    } catch (e) {
        next(e)
    }
})

module.exports = router;