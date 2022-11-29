const express = require("express");
const cors = require("cors");
const router = express.Router();

router.use(cors());

var con = require("../../db/Db_connection");
//Student API
// router.post("/admission_form", (req, res) => {
//   const admission = req.body;
//   const sqlinsert = `INSERT INTO students (name,lname,fname,faccupation,dob,rollno,gender,section,religion,addid,admissiondate,phone,email,address,clas) VALUES ('${admission.name}','${admission.lname}','${admission.fname}','${admission.faccupation}','${admission.dob}','${admission.rollno}','${admission.gender}','${admission.section}','${admission.religion}','${admission.addid}','${admission.admissiondate}','${admission.phone}','${admission.email}','${admission.address}','${admission.clas}')`;

//   console.log(admission);
//   con.query(sqlinsert, (error, result) => {
//     // console.log("resu", result);
//     res.send("record successfully inserted");
//     console.log(error);
//   });
// });

router.get("/list", (req, res) => {
  // res.send("hello")
  const sqlinsert =
    "SELECT stu.*, sec.name as section ,cl.className as class  FROM `students`  stu LEFT JOIN sections sec ON stu.sectionid=sec.id LEFT JOIN class cl ON stu.classid=cl.id";
  con.query(sqlinsert, (err, result) => {
    // console.log(result);
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});

router.get("/total", (req, res) => {
  const obj = {
    studentCount: 0,
    teacherCount: 0,
    transportCount: 0,
    totalPaid: 0,
    totalBalance: 0,
  };
  const sqlinsert = "SELECT count(*) as total FROM students";
  con.query(sqlinsert, (err, result) => {
    obj.studentCount = result[0].total;
    const sqlinsert2 = "SELECT count(*) as total1 FROM teachers";
    con.query(sqlinsert2, (err, result) => {
      obj.teacherCount = result[0].total1;
      const sqlinsert3 = "SELECT count(*) as total2 FROM transport";
      con.query(sqlinsert3, (err, result) => {
        obj.transportCount = result[0].total2;
        const sqlinsert4 = `SELECT SUM(Balance) as Balance FROM students`;
        con.query(sqlinsert4, (err, result) => {
          obj.totalBalance = result[0].Balance;
          const sqlinsert5=`SELECT SUM(paid) as PaidBalance FROM feecollection`;
          con.query(sqlinsert5,(err,result)=>{
            obj.totalPaid=result[0].PaidBalance;
            res.send(obj);
          })
        });
      });
    });
  });
});

router.post("/addupdate", (req, res) => {
  if (req.body.id !== "") {
    const sqlinsert = `UPDATE students SET name="${req.body.name}",lname="${req.body.lname}",fname="${req.body.fname}",faccupation="${req.body.faccupation}",dob="${req.body.dob}",rollno="${req.body.rollno}",gender="${req.body.gender}",sectionid="${req.body.sectionid}",religion="${req.body.religion}",addid="${req.body.addid}",admissiondate="${req.body.admissiondate}",phone="${req.body.phone}",email="${req.body.email}",address="${req.body.address}",classid="${req.body.classid}","${admission.Balance}" WHERE id="${req.body.id}"`;
    // res.send(sqlinsert)
    con.query(sqlinsert, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } else {
    const admission = req.body;
    const sqlinsert = `INSERT INTO students (name,lname,fname,faccupation,dob,rollno,gender,sectionid,religion,addid,admissiondate,phone,email,address,classid,Balance) VALUES ('${admission.name}','${admission.lname}','${admission.fname}','${admission.faccupation}','${admission.dob}','${admission.rollno}','${admission.gender}','${admission.sectionid}','${admission.religion}','${admission.addid}','${admission.admissiondate}','${admission.phone}','${admission.email}','${admission.address}','${admission.classid}','${admission.Balance}')`;

    con.query(sqlinsert, (error, result) => {
      // console.log("resu", result);
      res.send("record successfully inserted");
      console.log(error);
    });
  }
});

router.get("/Collection", (req, res) => {
  const sqlinsert = `SELECT gender, count(*) as total FROM students GROUP By gender`;
  con.query(sqlinsert, (er, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});


router.get("/Collection/graph", (req, res) => {
  const sqlinsert = `SELECT SUM(paid) as montlyPaidGrapgh ,YEAR(date) as year,
MONTH(date) as month FROM feecollection  group by YEAR(date), MONTH(date)
 order by YEAR(date), MONTH(date) `;
  con.query(sqlinsert, (er, result) => {
    const result2 = JSON.stringify(result);
    res.send(result2);
  });
});


router.delete("/delete", (req, res) => {
  const Id = req.body.id;
  // console.log(id)
  const sqlinsert = `DELETE FROM students WHERE id IN (${Id})`;
  con.query(sqlinsert, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
