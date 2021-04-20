const db = require('../db');
const express = require('express');
const slugify = ('slugify');
const router = express.Router();
const ExpressError = require('../expressError');

router.get("/", async (req, res, next) => {
    try {
        let results = await db.query('SELECT * FROM invoices;')
        res.json(results.rows)
    }
    catch (e) {
        next(e)
    }
})

router.get("/:id", async(req, res, next) => {
    try {
        let id = req.params.id;
        const result = await db.query(
            `SELECT i.id, 
                  i.comp_code, 
                  i.amt, 
                  i.paid, 
                  i.add_date, 
                  i.paid_date, 
                  c.name, 
                  c.description 
            FROM invoices AS i
            INNER JOIN companies AS c ON (i.comp_code = c.code)  
            WHERE id = $1`, [id]);
        
        if (result.rows.length === 0) {
            throw new ExpressError("Invalid id", 404)
        }
        
        const data = result.rows[0]
        const i = {
        id: data.id,
        company: {
            code: data.comp_code,
            name: data.name,
            description: data.description,
        },
        amt: data.amt,
        paid: data.paid,
        add_date: data.add_date,
        paid_date: data.paid_date,
        };
        return res.json({ invoices: i})
    }
    catch (e) {
        next(e)
    }
})

router.post("/",async (req, res, next) => {
    try {
        let { comp_code, amt } = req.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );
    return res.json({invoice: result.rows[0]})
    }
    catch(e){
        next(e)
    }
})

router.put("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const { amt, paid } = req.body;
        let paidDate = null;

        const currResult = await db.query(
            `SELECT paid
            FROM invoices
            WHERE id = $1`,
            [id]);

        if (currResult.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
        }

        const currPaidDate = currResult.rows[0].paid_date;

        if (!currPaidDate && paid) {
        paidDate = new Date();
        } else if (!paid) {
        paidDate = null
        } else {
        paidDate = currPaidDate;
        }

        const result = await db.query(
            `UPDATE invoices 
            SET amt=$1, paid=$2, paid_dates=$3 WHERE id=$4
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, paid, paidDate, id]
        );
        return res.json({ invoice: result.rows[0] })
    
    } catch (e) {
        next(e)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await db.query(
            `DELETE FROM invoices WHERE id=$1`, [id]
        )
        res.send({status: "deleted"})
    } catch (e) {
        next(e)
    }
})
module.exports = router;