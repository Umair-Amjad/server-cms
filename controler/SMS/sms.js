const express = require("express");
const router = express.Router();
const cors = require("cors");
const { verifyToken } = require("../Middleware/Jwt");
const con = require("../../db/Db_connection");
router.use(cors());

router.post("/sms/notification", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const data2 = req.body.id;
  data2.forEach((element) => {
    const sqlinsert = `SELECT * FROM students st where id=${element}`;
    con.query(sqlinsert, (err, result) => {
      console.log(result);
    });
  });

  console.log("sms notification", data);
});

module.exports = router;
