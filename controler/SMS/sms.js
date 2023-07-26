const express = require("express");
const router = express.Router();
const cors = require("cors");
const { verifyToken } = require("../Middleware/Jwt");
const con = require("../../db/Db_connection");
const SendSms = require("../utils/SendSMS");
router.use(cors());

router.post("/sms/notification", verifyToken, (req, res) => {
  const data = { user: { id: req.userId, institute_name: req.institute } };

  const data2 = req.body.id;
  data2.forEach((element) => {
    const sqlinsert = `SELECT st.id,st.name,st.phone FROM students st WHERE id=${element}`;
    con.query(sqlinsert, (err, result) => {
        if(err) throw err;
      SendSms({
        contactNo: result[0].phone,
      });
      console.log(result);
      console.log(result[0].phone);
    });
  });

  console.log("sms notification", data);
});

module.exports = router;
