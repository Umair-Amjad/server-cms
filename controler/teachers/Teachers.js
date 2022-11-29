
const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

var con =require('../../db/Db_connection');

// Teacher API
// router.post("/Teachers", (req, res) => {
//   const teachers = req.body;
//   const sqlinsert = `INSERT INTO teachers (name,lname,gender,idno,dob,degree,section,religion,phone,email,address) VALUES ('${teachers.name}','${teachers.lname}','${teachers.gender}','${teachers.idno}','${teachers.dob}','${teachers.degree}','${teachers.section}','${teachers.religion}','${teachers.phone}','${teachers.email}','${teachers.address}')`;
//   console.log("add", teachers);

//   con.query(sqlinsert, (err, result) => {
//     // console.log("result", result);

//     res.send({ message: "Teacher Record Successfully Added" });
//     console.log("err", err);
//   });
// });

router.get("/teachers/api", (req, res) => {
  // res.send('result2');
  const sqlinsert = "SELECT * FROM teachers WHERE 1";
  con.query(sqlinsert, (err, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.post("/addupdate",(req,res)=>{
  if(req.body.id !== ""){
    const sqlinsert = `UPDATE teachers SET name="${req.body.name}", lname="${req.body.lname}", gender="${req.body.gender}" ,idno="${req.body.idno}",dob="${req.body.dob}",degree="${req.body.degree}",section="${req.body.section}",religion="${req.body.religion}",phone="${req.body.phone}",email="${req.body.email}",address="${req.body.address}" WHERE id="${req.body.id}"`;
    // res.send(sqlinsert)
    // return
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  }else{
      const teachers = req.body;
      const sqlinsert = `INSERT INTO teachers (name,lname,gender,idno,dob,degree,section,religion,phone,email,address) VALUES ('${teachers.name}','${teachers.lname}','${teachers.gender}','${teachers.idno}','${teachers.dob}','${teachers.degree}','${teachers.section}','${teachers.religion}','${teachers.phone}','${teachers.email}','${teachers.address}')`;
      // console.log("add", teachers);

      con.query(sqlinsert, (err, result) => {
        // console.log("result", result);

        res.send({ message: "Teacher Record Successfully Added" });
        console.log("err", err);
      });
  }

})

router.delete("/delete", (req, res) => {
  const Id = req.body.id;
  const sqlinsert = `DELETE FROM teachers WHERE id IN  (${Id})`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
module.exports=router;