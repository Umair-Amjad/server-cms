const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

var con = require("../../db/Db_connection");

router.post("/transport", (req, res) => {
  const transport = req.body;
  const sqlinsert = `INSERT INTO transport (name,phone,License_no,vehicle_no,route_name) VALUES ('${transport.name}','${transport.phone}','${transport.License_no}','${transport.vehicle_no}','${transport.route_name}')`;

  con.query(sqlinsert, (err, result) => {
    // console.log("result", result);

    res.send({ message: "Transport Added Success fully" });
    console.log("err", err);
  });
});

router.get("/transports", (req, res) => {
  const sqlinsert = "SELECT * FROM transport WHERE 1"; 
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.post("/update",(req,res)=>{
 
  const sqlinsert = `UPDATE transport SET name="${req.body.name}", phone="${req.body.phone}", License_no="${req.body.License_no}", vehicle_no="${req.body.vehicle_no}", route_name="${req.body.route_name}" WHERE id="${req.body.id}"`;
  // res.send(sqlinsert)
  // return
  con.query(sqlinsert,(err,result)=>{
    if(err) throw err
    res.send(result)
  })
})

router.delete("/delete",(req,res)=>{
  const id = req.body.id;
  // console.log(req.body);
    // res.send(req.body.id); return
  const sqlinsert=`DELETE FROM transport WHERE id IN (${id})`;
  con.query(sqlinsert,(err,result)=>{
    if(err) throw err
    res.send(result)
  })
});


module.exports=router;