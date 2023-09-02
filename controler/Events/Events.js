const express = require('express');
const cors = require('cors')
const router = express.Router();

router.use(cors());
var con = require("../../db/Db_connection");
const ErrorHandler = require('../utils/ErrorHandler');
const AsyncError = require('../Middleware/AsyncError');
const { verifyToken } = require('../Middleware/Jwt');

router.get("/eventss", (req, res) => {
    const sqlinsert = "SELECT * FROM events WHERE status=1";
    con.query(sqlinsert, (err, result) => {
        res.status(200).send(result)
    })
})


router.post('/events', AsyncError(async (req, res, next) => {
    const data = { user: { id: req.userId, institute_name: req.institute } };
    const events = req.body.data
    const condition = events.allDay === true ? 1 : 0
    console.log(events)
    // return
    try {
        const sqlinsert = `INSERT INTO events (id, title, description, allDay, start, end, CollegeID, status) VALUES (NULL,'${events.title}','${events.description}','${condition}','${events.start}','${events.end}','${'1'}','${'1'}')`;
        con.query(sqlinsert, (err, result) => {
            console.log(sqlinsert)
            if (err) throw err;
            res.status(200).send(result)
        })
    } catch (err) {
        return next(new ErrorHandler("somthing went wrong", 500))
    }
}))

module.exports = router;